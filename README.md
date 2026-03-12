KM Factory Production Monitoring System

Node.js • MongoDB • React • MQTT • ESP32 • Raspberry Pi • Socket.io

writeUp : 

https://drive.google.com/file/d/1-T8GL-K-_aqgKs3YXEi8WDvVW10mNiTT/view?usp=sharing

A real-time production monitoring system for a leather factory that tracks output across multiple production lines and work tables.
The system integrates IoT devices, edge computing, and a web dashboard to provide live visibility into factory operations.

Problem :
Leather factory production lines currently rely on manual or partially recorded tracking, making it difficult to:
Monitor real-time output per table and production line
Identify bottlenecks during active shifts
Measure efficiency against predefined standard times
Detect delays or underperforming stages
Maintain structured shift-wise production records
Because data is not available in real time, supervisors cannot take timely corrective actions, resulting in reduced operational efficiency.

Solution
This system introduces a real-time monitoring architecture using IoT devices and edge computing.
Each production table has an ESP32 module with a button
When a product is completed, the button is pressed
The event is sent via MQTT to a Raspberry Pi
Raspberry Pi aggregates data and forwards it to the Node.js backend
Backend stores production metrics in MongoDB
Data is broadcast in real-time to a React dashboard using WebSockets
This enables instant monitoring of production efficiency and bottlenecks.

System Architecture : 
ESP32 → MQTT → Raspberry Pi (Edge Aggregator) → Node.js Backend → MongoDB → WebSocket → React Dashboard
Device Layer
ESP32 modules
Button press signals product completion
Edge Layer
Raspberry Pi per production line
Aggregates device data
Buffers and batches events before sending to backend

Backend
Node.js server
Handles shift-based production data
Stores metrics in MongoDB
Sends real-time updates via Socket.io

Frontend
React dashboard displaying production statistics

Dashboard Link:
https://km-factory-dashboard.vercel.app/

(Currently the dashboard uses mock data and will be connected to backend APIs.)

Key Features :
Real-time production monitoring
Table-level and line-level performance tracking
Shiftbased production analytics
Real-time dashboard updates
Scalable IoT architecture
Bottleneck detection
Efficiency calculations per table

Technologies Used
Hardware = ESP32, Raspberry Pi
Communication = MQTT
Backend = Node.js , Express.js , Socket.io
Database = MongoDB
Frontend = React.js
Deployment = Vercel (Dashboard)
Efficiency Calculation

Each table has a predefined standard production time.
Efficiency is calculated dynamically during a shift:
Average Actual Time = Total Time / Production Count
Efficiency = (Standard Time / Average Actual Time) × 100
This helps identify underperforming stations in real time.
Challenges and Solutions
1. Excessive API Calls
If each ESP32 directly called the backend, the system would generate thousands of API requests per second.
Solution:
Introduced Raspberry Pi edge aggregation
ESP32 sends data to Raspberry Pi
Raspberry Pi sends aggregated data to backend
This significantly reduces server load.

2. Device Communication Isolation
Each ESP32 should communicate only with the Raspberry Pi of its production line.
Solution:
Implemented MQTT topics per production line
Raspberry Pi subscribes only to its line's topic

3. Backend Overload
Even with edge aggregation, sending data for every button press would still overload the backend.
Solution:
Implemented buffering on Raspberry Pi
Data is batched and sent every few seconds
Benefits:
Reduced API calls
Reduced database writes
Improved system performance

4. Shift-Based Tracking
Factories run multiple shifts per day.
Solution:
Designed shift-based database structure
Each shift has its own lifecycle:
Start
Active
Close
This enables accurate performance analysis.

5. Real-Time Dashboard Updates
Continuous polling would overload the server.
Solution:
Implemented WebSockets (Socket.io)
Dashboard updates only when new data arrives
Project Status
Backend: In progress
Frontend: Working demo dashboard

Backend Repository:
https://github.com/eddycurrenƟ/KM-Factory-Backend
Future Improvements
Complete backend API integration
Role-based dashboards for supervisors
Historical analytics and reports
Machine learning for bottleneck prediction
Mobile monitoring interface

Author

Tejas Patil 
B.Tech Computer Science Student
Backend & Systems Developer
