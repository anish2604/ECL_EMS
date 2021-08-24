const mongoose = require("mongoose");
//const validator = require("validator");

const areaSchema = new mongoose.Schema({
    area_code:{
        type:Number,
        required: true
    },
    area_name:{
        type:String,
        required: true
    },
    area_abbr:{
        type:String,
        required: true
    },
    unit_code:{
        type:String,
        required: true
    },
    unit_name:{
        type:String,
        required: true
    }
})

const Area = new mongoose.model("Area", areaSchema);

module.exports = Area;