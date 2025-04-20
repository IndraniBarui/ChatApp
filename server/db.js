import mongoose from "mongoose";

const uri = 'mongodb://0.0.0.0:27017/chat';

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Db is connected!!")
}).catch(err =>{
    console.log('could not connect :', err.message)
})
