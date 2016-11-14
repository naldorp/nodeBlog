var mongoose = require("mongoose");

var userS = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        set: function(value){return value.trim().toLowerCase()},
    },
    password: String,
    isAdmin: Boolean(),
})

module.exports = mongoose.model('User',userS);