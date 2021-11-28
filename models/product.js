var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    productPermalink: String,
    productTitle: {type: String, required: true},
    productDescription: {type: String, required: true},
    productPrice: {type: Number, required: true},
    productPublished: String,
    productTags: String,
    productOptions: String,
    productAddedDate: Date,
    productImgDir: String,
    productFileDir: String,
    imagePath: String,
});

module.exports = mongoose.model('Product', productSchema);
