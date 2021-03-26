const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');


var app = express();
const port = process.env.PORT || 2000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ChatApp', 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false });

const userrouter = require('./src/routes/userRoutes')();
const Message = require('./src/model/dummymsg');

app.use(cors());
app.use(bodyparser.json());
app.use('/user', userrouter);

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    let user = '';
    // console.log("new user connected");
    // listening for an event from client
    socket.on("new message", (data)=>{
        // console.log(data);
        // socket.emit('message recieved', 'data');
        const newMessage = new Message({
            message: data,
            user: user
        })
        newMessage.save().then(rec => {
            if(rec) {
                io.emit('message recieved', rec)
            } else {
            }
        })
    })

    socket.on('new user', (data) => {
        user = data;
        console.log("new user connected" + user);
        socket.broadcast.emit('user connected', data);
        Message.find().then(rec => {
          if(rec) {
            socket.emit('all messages', rec)
          } else {
          }
        })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', user);
    })
    
})



server.listen(port, (err)=>{
    if(!err){console.log("Server listening at port", port)}
});