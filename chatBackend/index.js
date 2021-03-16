const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');


var app = express();
const port = process.env.PORT || 2000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ChatApp', 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false });

const userrouter = require('./src/routes/userRoutes')();

app.use(cors());
app.use(bodyparser.json());
app.use('/user', userrouter);


app.listen(port, (err)=>{
    if(!err){console.log("Server listening at port", port)}
});