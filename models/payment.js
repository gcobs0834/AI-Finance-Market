var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        "name" : String,
        "address": String,
        "cardName": String,
        "cardNo" : String,
        "cardExpMon" : String,
        "cardExpYear" : String,
        "cardCvc" : String,
});

module.exports = mongoose.model('Payment', schema);
