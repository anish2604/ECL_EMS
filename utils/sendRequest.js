
require("dotenv").config();
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendRequest = (to, from, subject, html) => {
    const msg = {
        to,
        from,
        subject,
        html:html
    }
    sgMail.send(msg, function(err, result){
        if(err){
            console.log(err);
            console.log('Request was NOT submitted');
        }else{
            console.log('Request Submitted !');
        }
    });
};

module.exports = sendRequest;


// const sendEmail = options => {
//     //transporter
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL,
//             password: process.env.PASSWORD
//         }
//     });
//     const options = {
//         from: process.env.EMAIL,

//     }
// }