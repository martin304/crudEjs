const express=require("express");
const router=express.Router();
const User=require("../models/users");
const multer=require('multer');
const fs=require('fs');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

var upload=multer({
    storage:storage
}).single("image");

router.post('/add',upload,async(req,res)=>{
    const newuser=new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename
    });
    
        await newuser.save();
     
       res.redirect('/');
})


router.get("/",async(req,res)=>{
   var users=await User.find({});
   
   res.render("pages/index",{title:"home page",users:users});

   
});

router.get("/add",(req,res)=>{
    res.render("pages/add_users",{title:"add users"})
})
router.get('/edit/:id',async(req,res)=>{
    let id=req.params.id;
    try {
        var user=await User.findById(id);
        console.log(user);
    
        if(user!=null){
        res.render("pages/edit_users",{title:"edit users",user:user})
        }else{
            res.redirect('/')
        }
    } catch (error) {
        res.redirect('/')
    }
})
 
router.post('/update/:id',upload,async(req,res)=>{
    let id=req.params.id;
    let new_image='';
    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err)
        }
    } else {
        new_image=req.body.old_image;
    }
  var user= await User.findById(id);
       user.name=req.body.name;
       user.email=req.body.email;
       user.phone=req.body.phone;
       user.image=new_image;
       await user.save().catch((error)=>{
        console.log(error);
    });
    res.redirect("/");
})
router.get('/delete/:id',async(req,res)=>{
    let id=req.params.id;
    try {
       var user= await User.findByIdAndRemove(id);
       if(fs.existsSync('./uploads/'+user.image)){
        console.log("文件存在"+user.image)
       try {
         await fs.unlinkSync('./uploads/'+user.image);
        
       } catch (error) {
        console.log(error)
       }
       }else{
        console.log("文件不存在"+user.image)
       }
       
       res.redirect("/");
       
    } catch (error) {
        console.log(error)
    }
    
})
module.exports=router;