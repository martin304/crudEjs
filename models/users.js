const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    email:{
        type:String,
        required:true,
        default:0
    },
    phone:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    }
},{
    timeStamp:true
}
)
  const User=mongoose.model("User",userSchema);
   module.exports=User;