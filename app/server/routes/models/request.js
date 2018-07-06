var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    Id: String,
    title: String,
    details: String,
    searchTags: [String],
    location: String,
    dateCreated: Number,
    businessName: String,
    props: Number,
    pic: String,
    quotationId: Number,
    proposals: [{
        name: String,
        image: String,
        request: String,
        id: String,
        date: Number,
        accepted: Boolean
    }]

});

module.exports = mongoose.model('requests', Schema);