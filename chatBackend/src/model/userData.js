const mongoose = require('mongoose');

const schema = mongoose.Schema;
const userSchema = new schema({
    username : String,
    Email : {type: String, unique:true},
    Password : String,
    friends:[{ name: String, isMuted:{type:Boolean, default:false}, isBlocked:{type:Boolean, default:false} }]
});

var userdata = mongoose.model("userdata", userSchema);

module.exports = userdata;