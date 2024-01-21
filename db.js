const mongoose=require('mongoose');
const mongoURI='mongodb://localhost:27017/flamingo';

const connectToMongo=()=>{
    mongoose.connect(mongoURI)
        console.log('connected to mongo succssfuly')
}
module.exports=connectToMongo;

