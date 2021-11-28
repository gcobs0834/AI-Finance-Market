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

    //商品檔1 若先連線會發生錯誤
    if (docs.productTitle == "Fund-基金-商品檔") {
      c.on('ready', function() {
        c.get('/Fund/S1/Full/FUNDS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/Fund-基金-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/Fund-基金-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔1結束

    //商品檔2
    if (docs.productTitle == "Fund-基金-K線檔") {
      c.on('ready', function() {
        c.get('/Fund/H1/Full/FUNDH1080F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/Fund-基金-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/Fund-基金-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔2結束

    //商品檔3
    if (docs.productTitle == "TW-台股-商品檔") {
      c.on('ready', function() {
        c.get('/TW/S1/Full/TWS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/TW-台股-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/TW-台股-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔3結束

    //商品檔4
    if (docs.productTitle == "TW-台股-K線檔") {
      c.on('ready', function() {
        c.get('/TW/H1/Full/TWH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/TW-台股-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/TW-台股-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔4結束

    //商品檔5
    if (docs.productTitle == "US-美股-商品檔") {
      c.on('ready', function() {
        c.get('/US/S1/Full/USS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/US-美股-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/US-美股-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔5結束

    //商品檔6
    if (docs.productTitle == "US-美股-K線檔") {
      c.on('ready', function() {
        c.get('/US/H1/Full/USH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/US-美股-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/US-美股-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔6結束

    //商品檔7
    if (docs.productTitle == "HK-港股-商品檔") {
      c.on('ready', function() {
        c.get('/HK/S1/Full/HKS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/HK-港股-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/HK-港股-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔7結束

    //商品檔8
    if (docs.productTitle == "HK-港股-K線檔") {
      c.on('ready', function() {
        c.get('/HK/H1/Full/HKH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/HK-港股-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/HK-港股-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔8結束

    //商品檔9
    if (docs.productTitle == "FS-國際指數-商品檔") {
      c.on('ready', function() {
        c.get('/FS/S1/Full/FSS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/FS-國際指數-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/FS-國際指數-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔9結束

    //商品檔10
    if (docs.productTitle == "FS-國際指數-K線檔") {
      c.on('ready', function() {
        c.get('/FS/H1/Full/FSH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/FS-國際指數-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/FS-國際指數-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔10結束

    //商品檔11
    if (docs.productTitle == "SG-新加坡期貨-商品檔") {
      c.on('ready', function() {
        c.get('/SG/S1/Full/SGS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SG-新加坡期貨-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SG-新加坡期貨-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔11結束

    //商品檔12
    if (docs.productTitle == "SG-新加坡期貨-K線檔") {
      c.on('ready', function() {
        c.get('/SG/H1/Full/SGH1100F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SG-新加坡期貨-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SG-新加坡期貨-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔12結束

    //商品檔13
    if (docs.productTitle == "SH-上海股市-商品檔") {
      c.on('ready', function() {
        c.get('/SH/S1/Full/SHS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SH-上海股市-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SH-上海股市-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔13結束

    //商品檔14
    if (docs.productTitle == "SH-上海股市-K線檔") {
      c.on('ready', function() {
        c.get('/SH/H1/Full/SHH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SH-上海股市-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SH-上海股市-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔14結束

    //商品檔15
    if (docs.productTitle == "SZ-深圳股市-商品檔") {
      c.on('ready', function() {
        c.get('/SZ/S1/Full/SZS1000F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SZ-深圳股市-商品檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SZ-深圳股市-商品檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔15結束

    //商品檔16
    if (docs.productTitle == "SZ-深圳股市-K線檔") {
      c.on('ready', function() {
        c.get('/SZ/H1/Full/SZH1130F.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/SZ-深圳股市-K線檔'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/SZ-深圳股市-K線檔';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔16結束

    //商品檔17
    if (docs.productTitle == "ETF-基本資料") {
      c.on('ready', function() {
        c.get('/BASIC/B1/ETF/ETFB10001.zip', function(err, stream) {
          if (err) throw err;
          stream.once('close', function() {
            c.end();
          });
          stream.pipe(fs.createWriteStream('./ftp/ETF-基本資料'));
          console.log("[ftp] download to NodeServer successfully.");
          // Set disposition and send to clients.
          var file = './ftp/ETF-基本資料';
          res.download(file);
          console.log("[ftp] download to UserSide successfully.");
        });
      });
      //start connection
      c.connect(ftpscheme.config);
    }
    //商品檔17結束

    //商品18
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