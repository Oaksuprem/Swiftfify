var mongoose = require('mongoose');
var quotationSchema = new mongoose.Schema({
     id: Number,
     processDate: String,
     to: [{
         name: String,
         id: String
     }],
     from: {
         buyerName: String,
         email: String
     },
    witness: [{
         name: String,
         designation: String
    }],
    items: [
        {
         desc: String,
         unit: String,
         qty: Number,
         price: Number,
         brand: String,
         origin: String,
         selection: String
        }
    ],
    biders: [
        {
            id: String,
            items: [
                {
                    desc: String,
                    unit: String,
                    qty: Number,
                    price: Number,
                    brand: String,
                    origin: String
                }
            ],
        }
    ]

});

module.exports = mongoose.model('quotations', quotationSchema);