const express = require("express");
const route = express.Router();
//this is to close a shift;
const Shift = require("../dbSchema/shift");
const table = require("../dbSchema/table");
const ShiftTableMetrics = require("../dbSchema/shiftTableMetrics");
route.post("/close",async (req,res)=>{
    try{   
        const {lineId} = req.query;
        if(!lineId){
            return res.status(400).json({message : "lineId missing"});
        }
        const shift1 = await Shift.findOne({ lineId, status: "active" });
        if(!shift1){
            return res.status(400).json({message: `There is no active shift of this line ${lineId}`});
        }
        shift1.status = "closed";
        shift1.endTime = new Date();
        await shift1.save();
        return res.status(200).json({message: "Shift closed"});
    }catch(e){
        console.log(e.message);
        return res.status(500).json({message : "The server has issue \"/close\""});
    }
});

route.post("/start", async(req,res)=>{
    try{
        const {lineId,shiftName} = req.query;
        if(!lineId || !shiftName){
            return res.status(400).json({message : "lineId missing"});
        }
        
        //check if any shift is active 
        const activeNow = await Shift.findOne({lineId , status: "active"});
        if(activeNow){
            activeNow.endTime = new Date();
            activeNow.status = "closed";
            await activeNow.save();
        }
        const shift1 = await Shift.create({lineId , shiftName, startTime : new Date() , status: "active" });
        if(!shift1){
            return res.status(400).json({message : "could not create new Shift"});
        }
        const tables = await table.find({lineId});
        for (const table of tables) {
            await ShiftTableMetrics.create({
            shiftId: shift1._id,
            tableId: table._id,
            todayCount: 0,
            totalTime: 0,
            avgActualTime: 0,
            efficiency: 0
          });
        }

        return res.status(200).json({message : "new Shift Started for this line"});
    }catch(e){
        return res.status(500).json({message : e.message});
    }
});

module.exports = route;