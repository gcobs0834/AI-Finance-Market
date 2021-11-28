const colors = require('colors');
const fs = require('fs');
const path = require('path');
const lunr = require('lunr');
let ObjectId = require('mongodb').ObjectID;

const restrictedRoutes = [
    {route: '/admin/product/new', response: 'redirect'},
    {route: '/admin/product/insert', response: 'redirect'},
    {route: '/admin/product/edit/:id', response: 'redirect'},
    {route: '/admin/product/update', response: 'redirect'},
    {route: '/admin/product/delete/:id', response: 'redirect'},
    {route: '/admin/product/published_state', response: 'json'},
    {route: '/admin/product/setasmainimage', response: 'json'},
    {route: '/admin/product/deleteimage', response: 'json'},
    {route: '/admin/order/statusupdate', response: 'json'},
    {route: '/admin/settings/update', response: 'json'},
    {route: '/admin/settings/option/remove', response: 'json'},
    {route: '/admin/settings/pages/new', response: 'redirect'},
    {route: '/admin/settings/pages/edit/:page', response: 'redirect'},
    {route: '/admin/settings/pages/update', response: 'json'},
    {route: '/admin/settings/pages/delete/:page', response: 'redirect'},
    {route: '/admin/settings/menu/new', response: 'redirect'},
    {route: '/admin/settings/menu/update', response: 'redirect'},
    {route: '/admin/settings/menu/delete/:menuid', response: 'redirect'},
    {route: '/admin/settings/menu/save_order', response: 'json'},
    {route: '/admin/file/upload', response: 'redirect'},
    {route: '/admin/file/delete', response: 'json'}
];

// common functions
exports.restrict = (req, res, next) => {
    exports.checkLogin(req, res, next);
};

exports.checkLogin = (req, res, next) => {
    // if not protecting we check for public pages and don't checkLogin
    if(req.session.needsSetup === true){
        res.redirect('/admin/setup');
        return;
    }

    if(req.session.user){
        next();
        return;
    }
    res.redirect('/admin/login');
};

// Middleware to check for admin access for certain route
exports.checkAccess = (req, res, next) => {
    const routeCheck = _.find(restrictedRoutes, {'route': req.route.path});

    // If the user is not an admin and route is restricted, show message and redirect to /admin
    if(req.session.isAdmin === false && routeCheck){
        if(routeCheck.response === 'redirect'){
            req.session.message = 'Unauthorised. Please refer to administrator.';
            req.session.messageType = 'danger';
            res.redirect('/admin');
            return;
        }
        if(routeCheck.response === 'json'){
            res.status(400).json({message: 'Unauthorised. Please refer to administrator.'});
        }
    }else{
        next();
    }
};

exports.showCartCloseBtn = (page) => {
    let showCartCloseButton = true;
    if(page === 'checkout' || page === 'pay'){
        showCartCloseButton = false;
    }

    return showCartCloseButton;
};



exports.clearSessionValue = (session, sessionVar) => {
    let temp;
    if(session){
        temp = session[sessionVar];
        session[sessionVar] = null;
    }
    return temp;
};

// gets the correct type of index ID
exports.getId = (id) => {
    if(id){
        if(id.length !== 24){
            return id;
        }
    }
    return ObjectId(id);
};


exports.indexProducts = (app) => {
    // index all products in lunr on startup
    return new Promise((resolve, reject) => {
        app.db.products.find({}).toArray((err, productsList) => {
            if(err){
                console.error(colors.red(err.stack));
                reject(err);
            }

            // setup lunr indexing
            const productsIndex = lunr(function(){
                this.field('productTitle', {boost: 10});
                this.field('productTags', {boost: 5});
                this.field('productDescription');

                const lunrIndex = this;

                // add to lunr index
                productsList.forEach((product) => {
                    let doc = {
                        'productTitle': product.productTitle,
                        'productTags': product.productTags,
                        'productDescription': product.productDescription,
                        'id': product._id
                    };
                    lunrIndex.add(doc);
                });
            });

            app.productsIndex = productsIndex;
            console.log(colors.cyan('- Product indexing complete'));
            resolve();
        });
    });
};
