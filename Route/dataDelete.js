const express = require("express");
const route = express.Router();
const Shift = require("../dbSchema/shift");
const shiftTable = require("../dbSchema/shiftTableMetrics");
const table = require("../dbSchema/table");
const Line = require("../dbSchema/line");
const ProductionEvent = require("../dbSchema/tableButtonPress");

//delete by shift
route.delete("/shift/:shiftId", async (req, res) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({message: "Shift not found"});
    }
    if (shift.status === "active") {
      return res.status(400).json({message: "Cannot delete active shift"});
    }
    await ProductionEvent.deleteMany({ shiftId });
    await shiftTable.deleteMany({ shiftId });
    await Shift.findByIdAndDelete(shiftId);
    return res.status(200).json({message: "Shift deleted successfully"});
  } catch (e) {
    return res.status(500).json({ message: e});
  }
});

//delete complete system
route.delete("/system/full-reset", async (req, res) => {
  try {
    await ProductionEvent.deleteMany({});
    await shiftTable.deleteMany({});
    await Shift.deleteMany({});
    await table.deleteMany({});
    await Line.deleteMany({});
    return res.status(200).json({message: "All data cleared"});

  }catch (e) {
    return res.status(500).json({message: e});
  }
});

route.delete("/system/runtime-reset", async (req, res) => {
  try {
    await ProductionEvent.deleteMany({});
    await shiftTable.deleteMany({});
    await Shift.deleteMany({});
    

    return res.status(200).json({
      message: "All runtime data cleared"
    });

  } catch (e) {
    return res.status(500).json({message: e});
  }
});

module.exports = route;