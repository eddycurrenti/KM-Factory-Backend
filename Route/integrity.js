const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");

route.get("/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;

    const dbStatus =
      dbState === 1 ? "connected" :
      dbState === 2 ? "connecting" :
      dbState === 0 ? "disconnected" :
      "unknown";

    return res.status(200).json({
      status: "ok",
      serverUptimeSeconds: process.uptime(),
      memoryUsageMB: {
        rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
        heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
      },
      database: dbStatus,
      timestamp: new Date()
    });

  } catch (e) {
    return res.status(500).json({status: "error",message: e.message});
  }
});

module.exports = route;
