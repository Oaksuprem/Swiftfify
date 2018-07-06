var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
     serial: Number,
    info:[{vendorName: String,
     email: String,
     invoiced: Boolean,
     dateInvoiced: Number,
     receipt: Boolean,
     top: String,
     pod: String,
     dor: String,
    items: [{
        origin: String,
        brand: String,
        price: Number,
        qty: Number,
        unit: String,
        desc: String,
        total_value: Number
    }],
        TotalValue: Number,
        AmountInWords: String
     }],
    approvals: [{
         name: String
    }],
    Id: String,
    approvedDate: String


});
module.exports = mongoose.model('lpos', Schema);