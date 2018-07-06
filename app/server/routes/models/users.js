var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
    Id:{type:Number,require:true},
    email:{type:String,require:true},
    password: {type:String,require:true},
    status: String,
    businessName: String,
    phone: String,
    supplier: {
      status: String,
      docs: [{
          uploaded: Boolean,
          name: String,
          status: String,
          url: String
      }]
    },
    address: {
        street: String,
        town: String,
        zip: String
    },
    pic: String,
    readQuotationTerms: Boolean,
    LPOTerms: Boolean,
    passCode: String,
    notifications: Number
});
userSchema.methods.generatHarsh = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};
userSchema.methods.validPassword =function (password) {
    return bcrypt.compareSync(password,this.password);
};
module.exports = mongoose.model('users', userSchema);