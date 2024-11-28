const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config()

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello World')
})
//routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use(bodyParser.urlencoded());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//log file
app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFile('log.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log(err);
        }
    }
    
    )
    
    next();
})

//error file
app.use((err,req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`
    fs.writeFile('error.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log(err);
        }
    }
    
    )
    res.status(500).send('Internal server error')
    next();
})

//db connection
app.listen(port,()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log(`Server is running at port ${port}`))
    .catch((err)=>(console.log(err)))
})