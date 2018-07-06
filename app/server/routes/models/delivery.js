var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    serial: Number,
    dateCreated: Number,
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
    delivers:[{
        items: [{
            desc: String,
            bal: Number,
            qty: Number,
            del: Number
        }],
        delivered: Boolean,
        date: String,
        received:String
    }]

});
module.exports = mongoose.model('delivery', Schema);