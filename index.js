const express = require("express");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./dbSchema/dbConnect.js");
const port = process.env.PORT || 3000;
app.use(express.json());

connectDB();
app.get("/", (req,res)=>{
    res.send("THIS IS BACKEND FOR KH FACTORY PRODUCTION LINE");
})

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.set("io", io);

server.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinLine", (lineId) => {
    socket.join(`line_${lineId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
