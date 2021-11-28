var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var twoFaAuth = require('./2fa');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');

// Admin section
router.get('/admin', isLoggedIn, (req, res, next) => {
	res.render('admin/admin.hbs');
});

// Display Orders
router.get('/admin/orders', isLoggedIn, function(req, res) {
	Order.find({ //find current user order
		user: req.user
	}, function(err, orders) {
		if (err) {
			return res.write('Error!');
		}
		var cart;
		orders.forEach(function(order) {
			cart = new Cart(order.cart); //Each order has its own cart
			order.items = cart.generateArray();
      console.log(order.items);
		})
		res.render('admin/orders', {
			orders: orders
		});
	});
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}


module.exports = router;
