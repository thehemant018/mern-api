const connectToMongo=require('./db.js');
const express=require('express');
require('dotenv').config();
var cors=require('cors');
connectToMongo()

const app=express();

app.use(express.json());

const port= process.env.PORT || 8000;

app.use(cors())
app.use(express.json());

app.use('/api/auth',require('./routes/auth.js'));

app.get('*',(req,res)=>{
    res.status(200).json({
        message:'bad request'
    })
})

app.listen(port,()=>{
    console.log(`flamingo backend is listing on http://localhost:${port}`);
})
