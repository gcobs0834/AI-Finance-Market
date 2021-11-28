var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var OrderForChain = require('../models/orderForChain');
var Order = require('../models/order');
var Payment = require('../models/payment');
var chainInvoke = require('../chaincode/newInvoke.js');




/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
      var productChunks = [];
      var chunkSize = 4;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', {title: 'AIF金融市集', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
     if (err) {
       console.log('errr');
         return res.redirect('/market');
     }
      cart.addOne(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/market');
  });
});
//shopping-cart page

router.post('/add-to-cart/:id/', function(req, res, next) {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
     if (err) {
         return res.redirect('/market');
     }
      cart.add(product, product.id, req.body.count);

      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/market');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
 if (!req.session.cart) {
     return res.render('shop/shopping-cart', {products: null});
 }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
  console.log(req.session);
  console.log(cart);
});


router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) { //if shopping cart is empty, redirect to shopping cart.
      return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});


//payment data input
router.post('/checkout', isLoggedIn, async function(req, res) {
    var cart = new Cart(req.session.cart);
    let itemsLength = Object.keys(cart.items).length
    let itemsArray = Object.keys(cart.items)
    if (!req.session.cart) {
      alert("The shopping cart is empty!")
      res.redirect('/shopping-cart');
    }

    let date = new Date()
    console.log(date)
    let expiry = new Date()
    expiry.setMonth(expiry.getMonth() + cart.totalQty)
    console.log(expiry)

    for(var i =0; i < itemsLength; i++){
      let order = new OrderForChain({
        buyer: req.user.local.username,
        seller: 'admin',
        productName: itemsArray[i],
        orderDate: date,
        expiryDate: expiry
      });
      console.log(order.id)
      

      await chainInvoke.createOrder([order.id, order.productName, order.seller,order.buyer, order.orderDate.toString(), order.expiryDate.toString()]);


      order.save()
    }

      var order = new Order({ //store payment order
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        payment: true,
        paymentDate: Date.now
      });

      order.save(function(err, result) {
        req.session.cart = null;
        res.render('shop/pay'); //get hbs
      });

    var newPayment = new Payment();
    // Get html form values. These rely on the "name" attributes
    // req.checkBody('cardNo','Invalid card number').notEmpty().isLength(16);
    // req.checkBody('cardCvc','Invalid card CVC').notEmpty().isLength(3);
    // var errors = req.validationErrors();
    // if(!errors) {
      newPayment.name = req.body.name;
      newPayment.address = req.body.address;
      newPayment.cardName = req.body.cardName;
      newPayment.cardNo = req.body.cardNumber;
      newPayment.cardExpMon = req.body.cardExpiryMonth;
      newPayment.cardExpYear = req.body.cardExpiryYear;
      newPayment.cardCvc = req.body.cardCvc;
      newPayment.save(function (err, result) {
        if (err) {
           return err;
        }
        return newPayment;
    });
    // }
    // else {
      // var messages = [];
      // errors.forEach(function(error){
      //   message.push(error.msg);
      //   return done(req.flash('error',messages))
      // })
    //}
});

// router.get('/pay', function(req, res) {
//     res.render('shop/pay', { title: 'paycompleted' });
//   })

router.get('/feedback', function (req, res, next) {
    res.render('feedback');

});
// router.post('/checkout', isLoggedIn, function(req, res, next) {
//   if (!req.session.cart) {
//       return res.redirect('/shopping-cart');
//   }
//   var cart = new Cart(req.session.cart);


  /*stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
  }, function(err, charge) {
      if (err) {
          req.flash('error', err.message);
          return res.redirect('/checkout');
      }
      var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
      });
      order.save(function(err, result) {
          req.flash('success', 'Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
      });
  }); */
// });


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
