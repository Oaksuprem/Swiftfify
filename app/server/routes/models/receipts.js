var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    to: {
        name: String,
        email: String
    },
    from: {
        name: String,
        email: String
    },
    dateCreated: Number,
    serial: String,
    amount: Number,
    confirmed: Boolean
});

module.exports = mongoose.model('receipts', Schema);