var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  number:{type:String},
  bondid:{type:String},
  fund_name:{type:String},
  value:{type:String},
  ma5:{type:String},
  rate:{type:String},

});


module.exports = mongoose.model('gi', schema);
