const express = require("express");
const route = express.Router();
const Shift = require("../dbSchema/shift");
const shiftTable = require("../dbSchema/shiftTableMetrics");
const Table = require("../dbSchema/table");

route.post("/sendData",async (req,res)=>{
    try{
        const {lineId , tables } = req.body;
        if(!lineId || !Array.isArray(tables) || tables.length === 0){
            return res.status(400).json({message : "data is missing"});
        }
        
        const activeShift = await Shift.findOne({lineId , status: "active"});
        if(!activeShift){
            return res.status(400).json({message : "no active shift for this line"});
        }
        
        const tabledata = await Table.find({_id: { $in: tables.map(t => t.tableId) }});
        const tableMap = {};
        tabledata.forEach(t =>{
            tableMap[t._id] = t;
        });

for (const data of tables) {
      const { tableId, incrementCount , cycleTime = 0} = data;
      
      const metrics = await shiftTable.findOne({
        shiftId: activeShift._id,
        tableId
      });

      if (!metrics) continue;
        const inc = Number(incrementCount) || 0;
        const time = Number(cycleTime) || 0;

        metrics.todayCount += inc;
        metrics.totalTime += time;

      metrics.avgActualTime =
        metrics.todayCount > 0
          ? metrics.totalTime / metrics.todayCount
          : 0;

      const table = tableMap[tableId];
      if (!table) continue;

        metrics.efficiency = metrics.avgActualTime > 0? (table.standardTime / metrics.avgActualTime) * 100: 0;

        await metrics.save();
}
        const io = req.app.get("io");

        io.to(`line_${lineId}`).emit("lineUpdated", {lineId, message: "Metrics updated"});
        return res.status(200).json({message : "Metrics Updated"});

    }catch(e){
        console.log(e);
        return res.status(500).json({message : e});
    }
});


route.get("/data", async (req,res)=>{
    try{
    const {lineId} = req.query;
    if(!lineId ){
        return res.status(400).json({message : "lineId or shiftId is not found"});
    }
    const shiftId2 = await Shift.findOne( {lineId , status : "active"});
    if(!shiftId2){
        return res.status(400).json({message : `${shiftId2} ki shift ni mili`});
    }
    const tables = await shiftTable.find({shiftId : shiftId2._id}).populate("tableId")
    if(tables.length == 0){
        return res.status(400).json({message : "PerTable data not found"})
    }
    return res.status(200).send(tables);}
    catch(e){
        return res.status(500).json({message : "/data sever error"});
    }
});



module.exports = route;