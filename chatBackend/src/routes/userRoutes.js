const express = require('express');
const userrouter = express.Router();
const userdata = require('../model/userData');
const jwt = require('jsonwebtoken');

function router(){

    function verifyToken(req, res, next){
        if(!req.headers.authorization){
            console.log('req header is not there!')
            return res.status(401).send('Unauthorized request');
        }
        let token = req.headers.authorization.split(' ')[1];
        if(token == null){
            console.log('token is not there!')
            return res.status(401).send('Unauthorised request.');
        }
        console.log('token is '+token);
        let payload = jwt.verify(token, 'adminAccess');
        console.log(payload);
        if(!payload){
            return res.status(401).send('Unauthorised request.');
        }
        req.userId = payload.subject;
        next();
    }

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
                console.log("OK registered");
                res.status(200).send({'msg': "Successfully Registered. PLease Login to Continue."});
            }
            else{
                res.status(401).send('User already exists with the same email or username. Please login or try using another username/email.');
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
        console.log(item);
        userdata.findOne(item, (err, user)=>{
            if(err) {
                console.log("error during login");
            }
            if(user) {
                res.status(200).send({'userid':user._id});
            }
            else {
                res.status(401).send("Invalid Username or Password.");
            }
        });
    })

    userrouter.get('/allusers', (req, res)=>{
        userdata.find((err, users)=>{
            if(err) {
                console.log("error during fetching all users.");
            }
            else {
                res.status(200).send(users);
                console.log("fetched all users.");
            }
        });
    });

    userrouter.post('/addContact/:id',function (req,res){
        var id = req.params.id;
        console.log('add friend ', req.body);
        var contact={
          name:req.body.user,
          isMuted:false,
          isBlocked:false
        }
        var update = userdata.findByIdAndUpdate(id, { $push: { friends: contact } },);
        update.exec(function (err,data){
          res.status(200).send(data);
        });
    });

    userrouter.get('/allfriends/:id', (req, res)=>{
        var id = req.params.id;
        userdata.findById(id, (err, user)=>{
            if(user) {
                res.status(200).send(user.friends);
            }
        })
    })

    userrouter.post('/blockUser/:sender', (req, res)=>{
        var sender = req.params.sender;
        var receiver = req.body.receiver;
        var value = req.body.value;
        userdata.findOne({"username":sender})
        .then((user) =>{
             
             user.friends.forEach(contact => {
               if(contact.name == receiver){
                contact["isBlocked"] = value;              
               }                           
             });
             user.save();
           
            console.log('Blocked '+receiver+ ' by '+ sender);
            res.status(200);
        })
    })

    userrouter.post('/muteUser/:sender', (req, res)=>{
        var sender = req.params.sender;
        var receiver = req.body.receiver;
        var value = req.body.value;
        userdata.findOne({"username":sender})
        .then((user) =>{
             
             user.friends.forEach(contact => {
               if(contact.name == receiver){
                contact["isMuted"] = value;              
               }                           
             });
             user.save();
           
            console.log('Muted '+receiver+ ' by '+ sender);
            res.status(200);
        })
    })


    return userrouter;
}


module.exports = router;