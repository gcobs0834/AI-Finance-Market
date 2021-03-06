const express = require('express');
const router = express.Router();
const board = require('../models/board');
const Comment = board.comment;
const Message = board.message;
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');
var ftpscheme = require('./ftpClient');
var ftpClient = require('ftp');
var fs = require('fs');


var id;
let productOut;

router.get('/product/:id', function(req, res) {
  id = req.params.id;
  let options = {};
  var bought = false;
  var orderItem = {};
  var productIn;

  Product.findOne({
    'productTitle': req.params.id
  }, function(err, docs) {
    if (err) {
      console.info(err.stack);
    }
    // if (result.productOptions != null) {
    //   options = JSON.parse(result.productOptions);
    // }
    productOut = docs;
    productIn = docs;

    console.log("product test")
    console.log(productOut);
    console.log(productIn);


    //check if user has bought the product
    //if bought, then the page will display the download button
    Order.find({
      user: req.user
    }, function(err, orders) {
      if (err) {
        return res.write('Error!');
      }
      var cart;
      orders.forEach(function(order) {
        cart = new Cart(order.cart); //Each order has its own cart
        order.items = cart.generateArray();
        orderItem = order.items[0].item.productTitle;
        if (req.params.id == order.items[0].item.productTitle) {
          bought = true;
        }
      });

      Message.find({
        "_Product": id
      }).populate('comments').exec(function(err, records) {
        console.log(productOut);
        console.log(productIn);
        res.render('shop/product.hbs', {
          results: productOut,
          title: req.params.id,
          options: options,
          session: req.session,
          messages: records,
          text: req.user.local.cnName,
          helpers: req.handlebars.helpers,
          bought: bought,
        });
      });
    });



  });



});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

router.post('/downloads/:id', isLoggedIn, function(req, res) {
  id = req.params.id;
  var query = Product.findOne({
    productTitle: id
  }).select('productTitle'); //find product file dir from db

  var c = new ftpClient();
  console.log(c);
  query.exec(function(err, docs) {
    if (err) {
      return res.redirect('back');
    }
    console.log(docs.productTitle) //ensure the routes are correct
    // Set disposition and send it.

    //?????????1 ???????????????????????????
    if (docs.productTitle == "Fund-??????-?????????") {
      c.on('ready', function() {
        c.get('/Fund/S1/Full/FUNDS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/Fund-??????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/Fund-??????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????1??????

    //?????????2
    if (docs.productTitle == "Fund-??????-K??????") {
      c.on('ready', function() {
        c.get('/Fund/H1/Full/FUNDH1080F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/Fund-??????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/Fund-??????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????2??????

    //?????????3
    if (docs.productTitle == "TW-??????-?????????") {
      c.on('ready', function() {
        c.get('/TW/S1/Full/TWS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/TW-??????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/TW-??????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????3??????

    //?????????4
    if (docs.productTitle == "TW-??????-K??????") {
      c.on('ready', function() {
        c.get('/TW/H1/Full/TWH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/TW-??????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/TW-??????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????4??????

    //?????????5
    if (docs.productTitle == "US-??????-?????????") {
      c.on('ready', function() {
        c.get('/US/S1/Full/USS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/US-??????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/US-??????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????5??????

    //?????????6
    if (docs.productTitle == "US-??????-K??????") {
      c.on('ready', function() {
        c.get('/US/H1/Full/USH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/US-??????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/US-??????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????6??????

    //?????????7
    if (docs.productTitle == "HK-??????-?????????") {
      c.on('ready', function() {
        c.get('/HK/S1/Full/HKS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/HK-??????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/HK-??????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????7??????

    //?????????8
    if (docs.productTitle == "HK-??????-K??????") {
      c.on('ready', function() {
        c.get('/HK/H1/Full/HKH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/HK-??????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/HK-??????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????8??????

    //?????????9
    if (docs.productTitle == "FS-????????????-?????????") {
      c.on('ready', function() {
        c.get('/FS/S1/Full/FSS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/FS-????????????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/FS-????????????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????9??????

    //?????????10
    if (docs.productTitle == "FS-????????????-K??????") {
      c.on('ready', function() {
        c.get('/FS/H1/Full/FSH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/FS-????????????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/FS-????????????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????10??????

    //?????????11
    if (docs.productTitle == "SG-???????????????-?????????") {
      c.on('ready', function() {
        c.get('/SG/S1/Full/SGS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SG-???????????????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SG-???????????????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????11??????

    //?????????12
    if (docs.productTitle == "SG-???????????????-K??????") {
      c.on('ready', function() {
        c.get('/SG/H1/Full/SGH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SG-???????????????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SG-???????????????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????12??????

    //?????????13
    if (docs.productTitle == "SH-????????????-?????????") {
      c.on('ready', function() {
        c.get('/SH/S1/Full/SHS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SH-????????????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SH-????????????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????13??????

    //?????????14
    if (docs.productTitle == "SH-????????????-K??????") {
      c.on('ready', function() {
        c.get('/SH/H1/Full/SHH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SH-????????????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SH-????????????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????14??????

    //?????????15
    if (docs.productTitle == "SZ-????????????-?????????") {
      c.on('ready', function() {
        c.get('/SZ/S1/Full/SZS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SZ-????????????-?????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SZ-????????????-?????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????15??????

    //?????????16
    if (docs.productTitle == "SZ-????????????-K??????") {
      c.on('ready', function() {
        c.get('/SZ/H1/Full/SZH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SZ-????????????-K??????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SZ-????????????-K??????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????16??????

    //?????????17
    if (docs.productTitle == "ETF-????????????") {
      c.on('ready', function() {
        c.get('/BASIC/B1/ETF/ETFB10001.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/ETF-????????????'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/ETF-????????????';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //?????????17??????

    //??????18
    if (docs.productTitle == "GI Selector") {
      res.redirect('/gis_ai');
    }
  });
});
//post message
router.post('/board/messages', function(req, res) {
  var messageInstance = new Message(req.body);
  messageInstance.name.push(req.user.local.cnName);
  messageInstance._Product.push(id);
  messageInstance.save(function(err) {
    return res.redirect('back');
  })
});


//Reply and post it
router.post('/board/comments', function(req, res) {
  var commentInstance = new Comment(req.body);

  Message.findOne({
    _id: req.body._Message
  }, function(err, record) {
    record.comments.push(commentInstance._id);
    record.save(function() {
      commentInstance.name.push(req.user.local.cnName);
      commentInstance.save(function(err) {
        console.log(commentInstance);
        return res.redirect('back');
      })
    })
  })
})



module.exports = router;