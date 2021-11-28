var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    buyer: {type: String},
    seller: {type: String},
    productName: {type: String},
    orderDate: {type:Date},
    expiryDate: {type:Date}
});

module.exports = mongoose.model('OrderForChain', schema);