var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
// var middleware = require("../middleware");


//INDEX - show all products
router.get("/productSearch", function(req, res){
    if(req.query.search) {
    	//fuzzy search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //global match & case-insensitive
        // Get all match products from DB
        Product.find({productTitle: regex}, function(err, allProducts){
           if(err){
               console.log(err);
           } else {
              if(allProducts) {
              	  res.render("shop/search",{searchProducts:allProducts});
          	 } else {
          	 	  noMatch = "No match in that query, please try again.";
            	  req.flash("error", "No matches")
        	      res.redirect('/market');
        	   }
           }
        });
    } else {
        // Get all products from DB
        Product.find({}, function(err, allProducts){
           if(err){
               console.log(err);
           } else {
              res.redirect('/market');
           }
        });
    }
});

//CREATE - add new Product to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to products array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newCampground = {name: name, image: image, description: desc, author:author}
//     // Create a new Product and save to DB
//     Product.create(newCampground, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to products page
//             console.log(newlyCreated);
//             res.redirect("/market");
//         }
//     });
// });

//NEW - show form to create new Product
// router.get("/new", middleware.isLoggedIn, function(req, res){
//    res.render("products/new"); 
// });

// SHOW - shows more info about one Product
// router.get("/:id", function(req, res){
//     //find the Product with provided ID
//     Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundProduct)
//             //render show template with that Product
//             res.render("products/show", {Product: foundProduct});
//         }
//     });
// });

// EDIT Product ROUTE
// router.get("/:id/edit", middleware.checkProductownErship, function(req, res){
//     Product.findById(req.params.id, function(err, foundProduct){
//         res.render("products/edit", {Product: foundProduct});
//     });
// });

// UPDATE Product ROUTE
// router.put("/:id",middleware.checkProductownErship, function(req, res){
//     // find and update the correct Product
//     Product.findByIdAndUpdate(req.params.id, req.body.Product, function(err, updatedCampground){
//        if(err){
//            res.redirect("/products");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/products/" + req.params.id);
//        }
//     });
// });

// DESTROY Product ROUTE
// router.delete("/:id",middleware.checkProductownErship, function(req, res){
//    Product.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/products");
//       } else {
//           res.redirect("/products");
//       }
//    });
// });

function escapeRegex(text) { //regular expression
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
