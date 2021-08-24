const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(() =>{
    console.log('success');
}).catch((err) =>{
    console.log(err);
})
