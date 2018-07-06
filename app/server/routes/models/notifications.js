var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
   toId: String,
    from: {
        name: String,
        email: String,
        pic: String
    },
    dateCreated: Number,
    serial: String,
    doc: String,
    note: String,
    read: Boolean
});

module.exports = mongoose.model('note', Schema);