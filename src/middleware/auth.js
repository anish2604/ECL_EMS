const jwt = require("jsonwebtoken");
const Employee = require("../models/registeredUser");

const auth = async(req,res,next) =>{
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await Employee.findOne({_id:verifyUser._id})
        const login_user = user.gr.substr(1);
        console.log(login_user);



        // req.token = token;
        // req.user = user;

        next();

    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;
// module.exports = {
//   login_user
// };
