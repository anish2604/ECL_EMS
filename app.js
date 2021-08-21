require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const app = express();
const path = require("path");
const ejs = require("ejs");
const bcrypt = require('bcryptjs');
var google = require("googleapis");
const cookie = require('js-cookie');
const cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {flash} = require('express-flash-message');
const Task = require("./src/models/Tasks");
const Request = require("./src/models/requests");
const Area = require("./src/models/areas");//Ankita's change
const Department = require("./src/models/departments");//Ankita's change
const sendEmail = require('./utils/sendEmail');
const sendRequest = require('./utils/sendRequest');

const mongoURI = process.env.MONGO_CONNECT;

var rank=0;
var userDetails;
var sess;

require("./src/db/conn");
const Employee = require("./src/models/registeredUser")
const {
  json
} = require("express");
const { gmail } = require('googleapis/build/src/apis/gmail');

const PORT = process.env.PORT || 8080;

const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
// const partials_path = path.join(__dirname, "./templates/partials");

app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);
//ejs.registerPartials(partials_path);

const store = new mongoDBSession({
  uri: mongoURI,
  collection: "mySessions"
})

app.use(session({
  secret: 'process.env.SECRET_KEY',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    expires: 900000
  }
}))

app.use(flash({sessionKeyName: 'flashMessage'}));

const isAuth = (req,res,next) => {
  if(req.session.isAuth){
    next()
  } else{
    res.redirect("login");
  }
}

app.get('/', (req, res) => {
  sess = req.session;
  res.render("index");
});

// app.get("/signup", (req, res) => {
//   res.render("register");
// });

app.get("/login", (req, res) => {

  res.render("login");
});

app.get("/forgotPassword", (req, res) => {
  res.render("forgotPassword");
})

app.get("/dashboard", isAuth, auth, (req, res) => {
  user=req.session.user;
  return res.render("dashboard", {user:user});
})

app.get("/assignTask", isAuth, auth, (req, res) => {
  //console.log(`this is the cookie used here ${req.cookies.jwt}`);
  res.render("assignTask");

})

app.get("/submitRequest", isAuth, auth, (req, res) => {
  //console.log(`this is the cookie used here ${req.cookies.jwt}`);
  res.render("submitRequest");

})


// app.get("/logout", async (req, res) => {
//   try {
//     console.log(req.user);
//     req.user.tokens = req.user.tokens.filter((currElement) => {
//       return currElement.token != req.token;
//     });
//     res.clearCookie("jwt");
//     console.log("Logout successfully !")

//     await req.user.save();
//     res.render("/")

//   } catch (error) {
//     res,
//     status(500).send(error);
//   }
//     res.render("/");

// })

app.get("/taskForm", isAuth, auth,(req, res) => {
  res.render("taskForm");
})

app.get("/assignRequests", isAuth, auth, (req, res) => {
  res.render("assignRequests");
})

app.get("/requestForm", isAuth, auth,(req, res) => {
  res.render("requestForm");
})

/* **************** Start of Anish's Changes ****************** */

app.get("/viewTasks", isAuth, auth,(req, res) => {
  res.render("viewTasks");
})

app.get("/viewAssignedTasks", isAuth, auth, (req, res) => {
  res.render("viewAssignedTasks");
})

app.get("/viewMyTasks", isAuth, auth, (req, res) => {
  res.render("viewMyTasks");
})

app.get("/requestStatus", isAuth, auth, (req, res) => {
  res.render("requestStatus");
})

app.get("/viewRating", isAuth, auth, (req, res) => {
  res.render("viewRating");
})

app.get("/rateEmployees", isAuth, auth, (req, res) => {
  res.render("rateEmployees");
})

app.get("/contact", isAuth, auth, (req, res) => {
  res.render("contact");
})

app.get("/changePassword", isAuth, auth, (req, res) => {
  res.render("changePassword");
})

/* **************** End of Anish's Changes ****************** */

app.get("/logout", (req,res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect("/")
  });
})

app.post("/logout", (req,res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect("/")
  });
})

app.post('/email', (req,res) => {
  res.json({message:'Email Sent!'})
})

//
//yhbJxOxEOoXSz9WQobn6W_o8WMeJqhgw
//signup

// app.post("/signup", async (req,res) =>{
//     try{

//         const password = req.body.password;
//         const cpassword = req.body.cpassword;

//         if(password==cpassword){
//              const registerEmployee = new Employee({
//                  first_name : req.body.first_name,
//                  middle_name : req.body.middle_name,
//                  last_name : req.body.last_name,
//                  phone : req.body.phone,
//                  email : req.body.email,
//                  address : req.body.address,
//                  gender : req.body.gender,
//                  designation : req.body.designation,
//                  password : password,
//                  cpassword : cpassword
//              })

//              console.log("the success part" + registerEmployee);

//              const token = await registerEmployee.generateAuthToken();
//              console.log("the token part"+token);

//              res.cookie("jwt", token, {
//                  expires:new Date(Date.now() + 30000),
//                  httpOnly:true
//              });
//              console.log(cookie);

//              const registered = await registerEmployee.save();
//              console.log("the page part"+registered);
//              res.status(201).render("index");
//         }else{
//             res.send("Passwords do not match!")
//         }
//     }catch(error){
//         res.status(400).send(error);
//         console.log("error part page")
//     }
// });

//login check

app.post("/login", async (req, res) => {
  try {

    const username = req.body.username;
    const password = req.body.password;
    const user = await Employee.findOne({
      ein: username
    }) //checking email in database with email entered. alternate: Employee.findOne({email});
    //const accessToken = jwt.sign(user.toJSON, process.env.SECRET_KEY)
    //res.json({ accessToken: accessToken})

    if(!user){
      res.render("login");
    }
    const registered = await user.save();
    //const isMatch = await bcrypt.compare(password, user.password);

    const token = await user.generateAuthToken();
    console.log("the token part is "+token);

    res.cookie("jwt", token, {
      expires:new Date(Date.now() + 900000),
      httpOnly:true
    });
    req.session.user = user;
    req.session.rank = user.gr.substr(1);
    if (password == user.password) {
      //console.log("password match")
      req.session.isAuth = true;
      const area = await Area.findOne({
        area_code:req.session.user.area_code
      });
      req.session.areaDetails=area;
      const dept = await Department.findOne({
        dept_code:req.session.user.dept_code
      });
      req.session.deptDetails=dept;
      res.status(200).render("dashboard", {user:user});
  } else {
      res.send("Invalid Credentials !!")
      //console.log("password different");
    }



  } catch (error) {
    res.status(400).send("Invalid Credentials !");
    console.log(error);
  }
});

app.post("/assignTask", isAuth, auth, async (req, res) => {
  try {

    const manname = req.body.search;//Ankita's change
    const user = await Employee.findOne({
      manname:manname//Ankita's change
    })
    //console.log(user.gr);
    req.session.taskTo = user;
    rank = user.gr.substr(1);
    //console.log(rank);
    //console.log(req.session.user);
    //console.log(req.session.rank);

    if(req.session.rank > rank){
      console.log("Success");
      res.status(201).render("taskForm");
      app.post("/sendEmail", async(req, res, next) => {
        const {title, taskDate, message} = req.body;
        const from = 'ecl.ems2021@gmail.com';
        const to = req.session.taskTo.email;
        const output = `
        <p style="font-size: 1.25em; color: #000;">You have recieved a new task!</p>
        <p style="color: #000;">Task is assigned by <b>${req.session.user.manname} (${req.session.user.desg})</b></p>
        <p style="color: #000;"><b>Task Title:</b> ${title}</p>
        <p style="color: #000;"><b>Task Due date:</b> ${taskDate}</p>
        <p style="color: #000;"><b>Task Details:</b> ${message}</p>
         `
         sendEmail(to, from, title, output)
         res.status(201).redirect("taskForm");
         try{
              const work = new Task({
                taskTo : to,
                taskFrom : req.session.user.email,
                taskTitle : title,
                taskDate : taskDate,
                taskDetails : message
            })
          const taskAdded = await work.save();
          console.log("Task Added!"+taskAdded);
        } catch(err){
            console.log(err);
        }



        next();
      })

    } else {
      console.log("Unsuccessful");
      res.send("You are not allowed to assign Task to the selected user !!")
    }
    // if (email) {
    //   res.status(201).render("taskForm");
    //   //console.log("password match")
    // } else {
    //   res.send("You are not allowed to assign Task to the selected user !!")
    //   //console.log("password different");
    // }

    next();

  } catch (error) {
    res.status(400).send("User doesnot exist !");
    console.log(error);
  }
});

app.post("/submitRequest",isAuth, auth, async (req, res) => {
  try {

    const manname = req.body.search;
    const user = await Employee.findOne({
      manname:manname
    })
    //console.log(user.gr);
    req.session.ReqTo = user;
    rank = user.gr.substr(1);
    console.log(rank);
    //console.log(req.session.user);
    //console.log(req.session.rank);

    if(req.session.rank < rank){
      console.log("Success");
      res.status(201).render("requestForm");
      app.post("/sendRequest",async(req, res, next) => {
        const {rtype, leaveFrom, leaveTill, rmessage} = req.body;
        const from = 'ecl.ems2021@gmail.com';
        const to = 'anishchattaraj2017@gmail.com';
        const output = `
        <p style="font-size: 1.05rem; color: #000;"><b>${req.session.user.manname} (${req.session.user.desg})</b> has requested for Leave!</p>
        <p style="color: #000;"><b>From:</b> ${leaveFrom} <br> <b>To:</b> ${leaveTill}</p>
        <p style="color: #000;"><b>Leave type:</b> ${rtype}</p>
        <p style="color: #000;"><b>Reason of Leave:</b> ${rmessage}</p>
        `
        sendRequest(to, from, rtype, output)
        res.status(201).redirect("requestForm");
        try{
              const requ = new Request({
                requestTo : to,
                requestFrom : req.session.user.email,
                leaveType : rtype,
                leaveReason : rmessage
            })
          const requestAdded = await requ.save();
          console.log("Requests Added!"+requestAdded);
        } catch(err){
            console.log(err);
        }
        next();
      })
    } else {
      console.log("Unsuccessful");
      res.send("You cannot submit request to given Email id!")
    }
    next();

  } catch (error) {
    res.status(400).send("User doesnot exist !");
    console.log(error);
  }
})
//Ankita's changes start
app.get("/profile", isAuth,auth, async (req, res) => {
  const user = req.session;
  res.render("profile",{user:user});
});
//Ankita's changes end
//app.post('/taskForm', (req,res) => {
//  res.render("sendEmail")
//})

// const createToken = async() =>{
//   jwt.sign({_id:"", secretkey})
// }

// function authenticate(req,res,next){
//       const authHeader = req.headers['authorization']
//       const token = authHeader && authHeader.split(' ')[1]
//       if(token==null)
//       return res.sendStatus(401)

//       jwt.verify(token, process.env.SECRET_KEY, (err,user) => {
//         if(err) return res.sendStatus(403)
//         req.user = user
//         next();
//       })
//     }

//Ankita's changes start
app.get('/autocomplete/', function(req,res,next){
  var regex= new RegExp(req.query["term"], 'i');
  var employeeFilter = Employee.find({manname:regex},{'manname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(50);
  employeeFilter.exec(function(err,data){

    let result=[];
    if(!err){
      if(data && data.length && data.length>0){
        data.forEach(user=>{
          let obj = {
          id: user.manname,
          label: user.manname
        };
        result.push(obj);
        });
        res.jsonp(result);
      }

    }
    else{
      console.log(err);
    }

  });
});
//Ankita's changes end

app.post("/dashboard", isAuth, auth,(req, res) => {
  user=req.session.user;
  res.render("dashboard", {user:user});
});

app.post("/profile", isAuth, auth,(req, res) => {
  res.render("profile");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});