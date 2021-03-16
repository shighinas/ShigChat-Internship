const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    username : String,
    Email : {type: String, unique:true},
    Password : String
});

var userdata = mongoose.model("userdata", userSchema);

module.exports = userdata;