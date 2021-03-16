const express = require('express');
const userrouter = express.Router();
const userdata = require('../model/userData');

function router(){

    userrouter.post('/reg', (req, res)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        var item = {
            username : req.body.username,
            Email : req.body.Email,
            Password : req.body.Password
        }
        userdata.findOne({ $or : [{Email: item.Email}, {username: item.username}] }, (err, user)=>{
            if(err){
                console.log("error during signUp server side validation"+ err);
            }
            if(!user){
                var user = userdata(item);
                user.save();
                res.status(200).send('success')
            }
            else{
                res.status(401).send('User already exists with the same email or username. Please login or try using another email.');
            }
        })
    });

    userrouter.post('/login', (req, res)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        var item = {
            username : req.body.username,
            Password : req.body.Password
        }
        userdata.findOne(item, (err, user)=>{
            if(err) {
                console.log("error during login");
            }
            if(user) {
                res.status(200).send('success');
            }
        });
    })


    return userrouter;
}


module.exports = router;