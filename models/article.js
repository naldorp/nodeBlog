var mongoose = require('mongoose');

//model definition
var articleS = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: [
            function(value) {
                return value.length <= 120
            },
            "Title is too long (120 max)"
        ],
        default: 'New Post'
    },
    text: String,
    isPublished: {
        type: Boolean,
        default: false
    },
    tags: [String]
});

//static methods
articleS.static({
    list: function(callback) {
        this.find({}, null, {
            sort: {
                _id: -1
            }
        }, callback);
    }
});


module.exports = mongoose.model('Article',articleS);