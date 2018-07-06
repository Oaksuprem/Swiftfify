var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    quatationId: Number,
    items: [
        {
          descr: String,
          supplierA: Number,
          supplierB: Number,
          supplierC: Number,
          awardTo: String
         }
        ],
    dateProcess: String,
    Id: Number

});
module.exports = mongoose.model('evaluations', Schema);