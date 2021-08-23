const mongoose = require("mongoose");
//const validator = require("validator");

const requestSchema = new mongoose.Schema({
    requestTo :{
        type: String,
        required: true
    },
    requestFrom :{
        type: String,
        required: true
    },
    name :{
        type: String,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    leaveTill:{
        type: Date,
        required: true
    },
    leaveFrom:{
        type:Date,
        required: true
    },
    leaveType :{
        type:String,
        required: true
    },
    leaveReason :{
        type: String,
        required: true
    }
})

const Request = new mongoose.model("Request", requestSchema);

module.exports = Request;
