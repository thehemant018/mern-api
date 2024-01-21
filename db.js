const mongoose=require('mongoose');
require('dotenv').config();
// const mongoURI='mongodb://localhost:27017/flamingo';

mongoURI=process.env.MONGO_URL;

const connectToMongo=()=>{
    mongoose.connect(mongoURI)
        console.log('connected to mongo succssfuly')
}
module.exports=connectToMongo;

