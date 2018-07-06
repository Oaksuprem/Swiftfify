var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    serial: Number,
    to:{
        businessName: String,
        address: String,
        phone: Number,
        email: String,
        address: {
            street: String
        }
    },
    from:{
        businessName: String,
        address: String,
        phone: Number,
        email: String,
        address: {
            street: String
        }
    },
    items: [{
        desc: String,
        rate: String
    }],
    approvedBy: [{
        name: String,
        design: String
    }],
    rated: Boolean,
    dateCreated: Number

});
module.exports = mongoose.model('inspection', Schema);