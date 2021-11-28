const express = require('express');
const colors = require('colors');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const common = require('../lib/common');
const router = express.Router();
const multer = require('multer');
var fileDirName, imgDirName;

router.get('/admin/products', (req, res, next) => {
    // get the top results
    Product.find((err, topResults) => {
        if(err){
            console.info(err.stack);
        }

        res.render('admin/product', {
            title: 'Cart',
            top_results: topResults,
            session: req.session,
            admin: true,
            config: req.app.config,
            message: common.clearSessionValue(req.session, 'message'),
            messageType: common.clearSessionValue(req.session, 'messageType'),
            helpers: req.handlebars.helpers
        });
    });
});



// insert form
router.get('/admin/product/new', (req, res) => {
    res.render('admin/product_new', {
        title: 'New product',
        session: req.session,
        productTitle: common.clearSessionValue(req.session, 'productTitle'),
        productDescription: common.clearSessionValue(req.session, 'productDescription'),
        productPrice: common.clearSessionValue(req.session, 'productPrice'),
        productPermalink: common.clearSessionValue(req.session, 'productPermalink'),
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        editor: true,
        admin: true,
        config: req.app.config
    });
});

//set product file upload folder and filename
var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadFolder = './fileStorage/';
        createFolder(uploadFolder);
        cb(null, uploadFolder);   // save folder
    },
    filename: function (req, file, cb) {
        //filename-Date
        var extname = path.extname(file.originalname);
        cb(null,Date.now()+ extname);
    }
});

// storage to make file store in own folder
var uploadFile = multer({ storage: fileStorage, onError: function(err, next) {
    console.log('error', err);
    next(err);
}  });

//product upload
router.post('/admin/product/uploadProductFile', uploadFile.single('productFile'), function(req, res, next){
    var file = req.productFile;
    fileDirName = '../fileStorage/'+req.file.filename;
    console.log(fileDirName);
    res.render('admin/product_new',{ success: "You've successfully upload the file!" });
});


router.post('/admin/product/insert', function(req, res){
    var doc = new Product();
    doc.productPermalink = req.body.frmProductPermalink;
    doc.productTitle = req.body.frmProductTitle
    doc.productPrice = req.body.frmProductPrice
    doc.productDescription = req.body.frmProductDescription
    doc.productPublished = req.body.frmProductPublished
    doc.productTags = req.body.frmProductTags
    doc.productOptions = req.body.productOptJson
    doc.productAddedDate = new Date();
    doc.productFileDir = fileDirName;
    doc.productImgDir = imgDirName;


    Product.findOne({'productPermalink': req.body.frmProductPermalink}, function(err, product) {
        if (err) console.info(err.stack);
        if(product){
            //if permalink exits
            req.session.message = 'Permalink already exist. Pick a new one.';
            req.session.messageType = 'danger';

            //keeep the current session
            req.session.productTitle = req.body.frmProductTitle;
            req.session.productDescription = req.body.frmProductDescription;
            req.session.productPrice = req.body.frmProductPrice;
            req.session.productPermalink = req.body.frmProductPermalink;
            req.session.productPermalink = req.body.productOptJson;
            req.session.productTags = req.body.frmProductTags;
            // redirect to new page

            res.redirect('/admin/product/new');
        }else{
            doc.save(function(err, result){
                if (err){
                    console.log(colors.red('Error inserting document: '+ err));
                    //keeep the current session
                    req.session.productTitle = req.body.frmProductTitle;
                    req.session.productDescription = req.body.frmProductDescription;
                    req.session.productPrice = req.body.frmProductPrice;
                    req.session.productPermalink = req.body.frmProductPermalink;
                    req.session.productPermalink = req.body.productOptJson;
                    req.session.productTags = req.body.frmProductTags;

                    req.session.message = 'Error: Inserting product';
                    req.session.messageType = 'dangerr';
                    //redirect to new
                    res.redirect('/admin/product/new');
                }else{
                    //get the new ID
                    let newId = result._id;

                    //add to lunr index
                    common.indexProducts(req.app).then(() =>{
                        req.session.message = 'New Product has successfully created';
                        req.session.messageType = 'success';
                        console.log('here2')
                        //redirect to the product edit page
                        res.redirect('/admin/product/edit/' + newId);
                    });
                    console.log('here2')
                    return result;
                }
            });
            res.redirect('/admin/products');
        }
    } )
})


//render to editted page
router.get('/admin/product/edit/:id', function(req, res){
    Product.findById(req.params.id, function(err, result){
        if (err) console.info(err.stack);
        let options = {};
        if(result.productOptions){
            options = JSON.parse(result.productOptions);
        }

        res.render('admin/product_edit', {
            title:'Edit Product',
            result: result,
            options: options,
            admin: true,
            session: req.session,
            message: common.clearSessionValue(req.session, 'message'),
            messageType: common.clearSessionValue(req.session, 'messageType'),
            config: req.app.config,
            editor: true,
            helpers: req.handlebars.helpers
        });
    });
});

// editting page post method
// Update an existing product form action
router.post('/admin/product/update', common.restrict, common.checkAccess, (req, res) => {
    const db = req.app.db;

    db.products.findOne({_id: common.getId(req.body.frmProductId)}, (err, product) => {
        if(err){
            console.info(err.stack);
            req.session.message = 'Failed updating product.';
            req.session.messageType = 'danger';
            res.redirect('/admin/product/edit/' + req.body.frmProductId);
            return;
        }
        db.products.count({'productPermalink': req.body.frmProductPermalink, _id: {$ne: common.getId(product._id)}}, (err, count) => {
            if(err){
                console.info(err.stack);
                req.session.message = 'Failed updating product.';
                req.session.messageType = 'danger';
                res.redirect('/admin/product/edit/' + req.body.frmProductId);
                return;
            }
            if(count > 0 && req.body.frmProductPermalink !== ''){
                // permalink exits
                req.session.message = 'Permalink already exists. Pick a new one.';
                req.session.messageType = 'danger';

                // keep the current stuff
                req.session.productTitle = req.body.frmProductTitle;
                req.session.productDescription = req.body.frmProductDescription;
                req.session.productPrice = req.body.frmProductPrice;
                req.session.productPermalink = req.body.frmProductPermalink;
                req.session.productTags = req.body.frmProductTags;
                req.session.productOptions = req.body.productOptJson;

                // redirect to insert
                res.redirect('/admin/product/edit/' + req.body.frmProductId);

            }else{
                common.getImages(req.body.frmProductId, req, res, (images) => {
                    let productDoc = {
                        productTitle: req.body.frmProductTitle,
                        productDescription: req.body.frmProductDescription,
                        productPublished: req.body.frmProductPublished,
                        productPrice: req.body.frmProductPrice,
                        productPermalink: req.body.frmProductPermalink,
                        productTags: req.body.frmProductTags,
                        productOptions: req.body.productOptJson
                        // productImgDir: imgDirName;
                    };

                    // if no featured image
                    if(!product.productImage){
                        if(images.length > 0){
                            productDoc['productImage'] = images[0].path;
                        } else {
                            productDoc['productImage'] = '/uploads/placeholder.png';
                        }
                    } else {
                        productDoc['productImage'] = product.productImage;
                    }

                    db.products.update({_id: common.getId(req.body.frmProductId)}, {$set: productDoc}, {}, (err, numReplaced) => {
                        if(err){
                            console.error(colors.red('Failed to save product: ' + err));
                            req.session.message = 'Failed to save. Please try again';
                            req.session.messageType = 'danger';
                            res.redirect('/admin/product/edit/' + req.body.frmProductId);
                        }else{
                            // Update the index
                            common.indexProducts(req.app)
                            .then(() => {
                                req.session.message = 'Successfully saved';
                                req.session.messageType = 'success';
                                res.redirect('/admin/product/edit/' + req.body.frmProductId);
                            });
                        }
                    });
                });
            }
        });
    });
});


router.post('admin/product/update', function(req, res) {
    Product.findById(req.params.id, function(err, result) {
        if (err){
            console.info(err.stack);
            req.session.message = 'Failed updating product.';
            req.session.messageType = 'danger';
            res.redirect('/admin/product/edit/' + req.body.frmProductId);
            return;
        }


    })
})

router.get('/admin/product/delete/:id', function(req, res){
      Product.deleteOne({_id : req.params.id}, function (err) {
        if (err) {
          console.info(err.stack);
          req.session.message = 'Failed to delete product.';
        }
        //need to refresh manully to see the change
        res.redirect('back');
      });
});



// uploads image
var createFolder = function(folder){ //create upload folder
    try {
        fs.accessSync(folder);
    } catch(e) {
        fs.mkdirSync(folder);
    }
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadFolder = './uploadFile/';
        createFolder(uploadFolder);
        cb(null, uploadFolder);   // save folder
    },
    filename: function (req, file, cb) {
        //filename-Date
        var extname = path.extname(file.originalname);
        cb(null,Date.now()+ extname);
    }
});

// storage to make file store in own folder
var upload = multer({ storage: storage, onError: function(err, next) {
    console.log('error', err);
    next(err);
} });

router.post('/admin/file/upload', upload.single('upload_file'), function(req, res, next){
    var file = req.upload_file;
    console.log(req.file.filename);
    imgDirName = './uploadFile/'+req.file.filename;
    // res.redirect('/admin/product/edit/');// + req.body.frmProductId
    res.render('admin/product/update',{ success: "You've successfully upload the file!" });
});



module.exports = router;
