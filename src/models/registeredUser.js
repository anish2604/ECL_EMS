const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const employeeSchema = new mongoose.Schema({

    ein :{
        type: Number,
        unique: true,
    },
    manno :{
        type:Number,
        unique: true,
    },
    manname :{
        type:String,
    },
    desg :{
        type: String,

    },
    gr :{
        type:String,
    },
    dob :{
        type: Date,
    },
    email :{
        type:String,
        unique: true,
    },
    area_code :{
        type: Number,
    },
    dept_code:{
        type:Number,
    },
    password :{
      type:Number,
      required: true,
    },
    tokens:[{
        token:{
            type: String,
            required:true,
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token}) //key and value is same you can write ({token})
        await this.save();
        return token;
    }catch(error){
        res.send("the error part "+error);
        console.log("the error part "+error);
    }
}

// employeeSchema.pre("save", async function(next) {

//     if(this.isModified("password")){
//         //const passwordHash = await bcrypt.hash(password, 4);
//         //console.log(`current password is ${this.password}`);
//         this.password = await bcrypt.hash(this.password, 12);
//         //console.log(`current password is ${this.password}`);
//         this.cpassword = await bcrypt.hash(this.password, 12);;
//     }
//     next();
// })

const Employee = new mongoose.model("Employee", employeeSchema);

module.exports = Employee;
