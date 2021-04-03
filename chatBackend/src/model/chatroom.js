const mongoose = require('mongoose');

const schema = mongoose.Schema;
const chatroomSchema = new schema({
    messages: {type: String, required: true},
    receiver: String,
    sender: String,
    image:String,
    createAt: {type: Date, default: Date.now()}
});

var crdata = mongoose.model("chatRoom", chatroomSchema);

module.exports = crdata;