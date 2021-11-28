var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    orderDate: {type:Date, default: Date.now},
    payment: {type: Boolean, default:false},
    paymentDate: {tpye:Date},
    // paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);