const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const multer = require('multer');
var path = require('path');


var app = express();
const port = process.env.PORT || 2000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ChatApp', 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false });

const userrouter = require('./src/routes/userRoutes')();
const Message = require('./src/model/chatroom');

app.use(cors());
app.use(bodyparser.json());
app.use('/user', userrouter);


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        var date=new Date().toDateString();
        callBack(null, `${file.originalname}`)
    }
})
const upload = multer({ storage: storage })

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    let user = '';
    let receiver = '';
    // console.log("new user connected");
    // listening for an event from client
    socket.on("new message", (data)=>{
        // console.log(data);
        // socket.emit('message recieved', 'data');
        const newMessage = new Message({
            messages: data.message,
            image: data.image,
            sender: user,
            receiver: receiver
        })
        console.log("sender: " + newMessage.sender +", receiver: "+ newMessage.receiver);
        newMessage.save().then(rec => {
            if(rec) {
                io.emit('message recieved', rec)
            } else {
            }
        })
    })

    socket.on('receiver', (data)=>{
        receiver = data;
        console.log("receiver " + receiver);
        Message.find({$or: [{$and: [{sender:user}, {receiver:receiver}]}, {$and: [{sender:receiver}, {receiver:user}]}]})
        .then(rec => {
            if(rec) {
                console.log(rec);
              socket.emit('all messages', rec)
            } else {
            }
        })
    })

    socket.on('new user', (data) => {
        user = data;
        console.log("new user connected " + user);
        socket.broadcast.emit('user connected', data);
        // Message.find().then(rec => {
        //   if(rec) {
        //     socket.emit('all messages', rec)
        //   } else {
        //   }
        // })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', user);
    })
    
})

app.post('/file', upload.single('file'), (req, res, next) => {
    console.log("file is...",req.file);
    const file = req.file;
    console.log('Uploading file..');
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
})
app.get('/uploads/:image', (req, res)=>{
    var mime = {
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
    };
    var dir = path.join(__dirname, 'uploads');
    // console.log("diresctory " + dir);
    var file = path.join(dir, req.params.image);
    var type = mime[path.extname(file).slice(1)]
    res.set('Content-Type', 'image/*');
    res.send(file);
})


server.listen(port, (err)=>{
    if(!err){console.log("Server listening at port", port)}
});