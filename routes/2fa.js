var express = require('express');
var router = express.Router();
var speakeasy = require('speakeasy')
var qr = require('qr-image');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Authen = {}


//Sign Up 2FA authenticator

router.get('/signauth', function(req, res, next){
    //get new secret,qr display on website
    Authen.secret = speakeasy.generateSecret({length: 20})
    Authen.qrPath = '/qrcode?qrurl=' + encodeURIComponent(Authen.secret.otpauth_url);
    //get the token from new secret for verify the account
    Authen.token = getToken(Authen.secret.base32);
    Authen.test = getToken(req.body.secret);
    res.render('user/2fa',{
        tittle:'Google Authenticator 認證',
        Authen
    })
});
router.post('/signauth', function(req, res) {
  User.findOne({'local.email': req.user.local.email}, function(err, user){
    if(err) return err;
    if(verifyToken(Authen.secret.base32, req.body.token)){
      user.local.googleAuthenticatorSecret = Authen.secret.base32;
      user.save(function (err, result){
        if (err) return err;
        return result;
      });
        res.redirect('/');
    }
      else{
       res.redirect('signauth');
     }
  })
});


//login
router.get('/GoogleAuth', isLoggedIn, function(req, res){
	var messages = req.flash('error');
		res.render('user/GoogleAuth', {
			title:'GoogleAuth',
			hasErrors: messages.length > 0,
			messages: messages
		});
});

router.post('/GoogleAuth', passport.authenticate('local.googleauth', {
	successRedirect: '/',
	failureRedirect: '/GoogleAuth',
	failureFlash: true
}));


router.get('/qrcode', function(req, res) {
  var code = qr.image(req.query.qrurl, { type: 'png' });
  res.type('png');
  code.pipe(res);
});
  
  function getToken(secret) {
    return speakeasy.time({secret: secret, encoding: 'base32'})
  }
  
  function verifyToken(secret, token) {
    return speakeasy.time.verify({secret: secret, encoding: 'base32', token: token})
  }
  
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
  
  function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }


module.exports = router;