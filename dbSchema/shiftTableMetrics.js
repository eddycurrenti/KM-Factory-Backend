const mongoose = require("mongoose");
const shiftTableMetricsSchema = new mongoose.Schema(
  {
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
      index: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },
    todayCount: {
      type: Number,
      default: 0,
    },

    totalTime: {
      type: Number, // sum of cycle times
      default: 0,
    },

    avgActualTime: {
      type: Number,
      default: 0,
    },

    efficiency: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

shiftTableMetricsSchema.index({ shiftId: 1, tableId: 1 }, { unique: true });

module.exports =  mongoose.model("ShiftTableMetrics", shiftTableMetricsSchema);
