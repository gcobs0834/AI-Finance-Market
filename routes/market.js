var express = require('express');
var router = express.Router();
var Product = require('../models/product'); // fetch products data from models/product
var ftpscheme = require('./ftpClient');
var ftpClient = require('ftp');
var fs = require('fs');

router.get('/market', function(req, res, next) {
	var products = Product.find( function(err, docs) {
	var productChunks = [];
	var chunkSize = 2;
	for(var i = 0; i < docs.length; i += chunkSize) {
		productChunks.push(docs.slice(i, i+chunkSize));
	}
	res.render('./shop/market.hbs', { title: 'Market', products: productChunks });
  }
  );
});


//shopping-cart page
router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart.items);
    res.render('/shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});






module.exports = router;
