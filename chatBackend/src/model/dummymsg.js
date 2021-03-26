const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    message: {type: String, required: true},
    user: {type: String, required: true},
    createAt: {type: Date, default: Date.now()}
});

var msgdata = mongoose.model("Message", userSchema);

module.exports = msgdata;