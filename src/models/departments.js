const mongoose = require("mongoose");
//const validator = require("validator");

const departmentSchema = new mongoose.Schema({
    dept_code:{
        type:Number,
        required: true
    },
    dept_name:{
        type:String,
        required: true
    },
    dept_abbr:{
        type:String,
        required: true
    }
})

const Department = new mongoose.model("Department", departmentSchema);

module.exports = Department;