const mongoose=require('mongoose');
const {Schema} =mongoose;
const userSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
    },
    
    password:{
        type:String,
        require:true
    },
    timeStamp:{
        type:String,
        default:new Date(+new Date() + 7*24*60*60*1000)
    },
})

module.exports=mongoose.model('user',userSchema)