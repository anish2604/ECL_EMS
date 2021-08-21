const mongoose = require("mongoose");
//const validator = require("validator");

const taskSchema = new mongoose.Schema({
    taskTo :{
        type: String,
        required: true
    },
    taskFrom :{
        type:String,
        required: true
    },
    taskTitle :{
        type:String,
        required: true
    },
    taskDate :{
        type: Date,
        required: true
    },
    taskDetails :{
        type: String,
        required: true
    }
})

const Task = new mongoose.model("Task", taskSchema);

module.exports = Task;