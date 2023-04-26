require('dotenv').config();
const express=require('express')
const mongoose=require('mongoose')
const session=require('express-session')

const app=express();
const PORT=process.env.PORT||4000
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"my secret",
    saveUninitialized:true,
    resave:false
}))
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})
app.use(express.static('uploads'))
app.set('view engine','ejs')
app.use('',require("./routes/routes"))

mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/node_crud')
.then(()=>{
    console.log("database is connected")
    // Start server
    
    app.listen(PORT,()=>{
        console.log(`server start at localhost:${PORT}`)
    });
}).catch((error)=>{
    console.log(error);
})
