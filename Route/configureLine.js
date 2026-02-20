const express = require("express");
const route = express.Router();
const Line = require("../dbSchema/line");
const tables = require("../dbSchema/table");

route.post("/line", async (req,res)=>{
    try{
        const {name , description} = req.body;
        if(!name || !description){
            return res.status(400).json({message : "name or description is missing"});
        }
        
        const exist = await Line.findOne({ name });
        if(exist){
            return res.status(400).json({message : "Line already exists"});
        }
        const line = await Line.create({name, description});
        res.status(201).json(line);
    }catch(e){
        return res.status(500).json({message: e});
    }
});


route.get("/lines" , async (req,res)=>{
    try{
    const lines = await Line.find();
    res.json(lines);
    }catch(e){
        return res.status(500).json({message: e});
    }
});

route.post("/table", async (req,res)=>{
    try{
    const {lineId , name , standardTime , order} = req.body;
    if(!lineId || !name || !standardTime || !order){
        return res.status(400).json({message : "Some incoming data is missing"});
    }
    const lineExists = await Line.findById(lineId);
if (!lineExists) {
  return res.status(400).json({
    message: "Line does not exist"
  });
}

    const exist = await tables.findOne({lineId, name});
    if(exist){
        return res.status(400).json({message : `${name} table already exists`});
    }
    const table = await tables.create({lineId , name, standardTime , order});
    res.status(201).json({message : "data is created"});
}catch(e){
    return res.status(500).json({message : e});
}
});

route.get("/tables", async (req,res)=>{
    try{
        const {lineId} = req.query;
        if(!lineId){
            return res.status(400).json({message: "LineId is missing"});
        }
        const Tables = await tables.find({lineId}).sort({order: 1});
        if(Tables.length === 0){
            return res.status(200).send(Tables);
        }
        return res.status(200).send(Tables);
    }catch(e){
        return res.status(500).json({message : e});
    }
});

module.exports = route;