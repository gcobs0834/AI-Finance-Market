var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Sign up
router.get('/signup', function(req, res){
	var messages = req.flash('error');
	res.render('user/signup', {
		title:'Sign Up', 
		hasErrors: messages.length >0,
		messages: messages
	});
});

router.post('/signup', passport.authenticate('local.signup',{
	successRedirect: '/signauth',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/login', function(req, res){
	var messages = req.flash('error');
		res.render('user/login', {
			title:'Log In',
			hasErrors: messages.length > 0,
			messages: messages
		});
});

//login
router.post('/login', passport.authenticate('local.login', {
	successRedirect: '/GoogleAuth',
	failureRedirect: '/user/login',
	failureFlash: true
}));

router.get('/logout', function(req, res, next) {
	req.logout();
	return res.redirect('/');
});

//facebook
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback', 
	 passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/user/signup' }));

//text
router.get('/test', function(req, res){
	res.render('test');
});

router.get('/profile', function(req, res){
	res.render('user/profile');
})

module.exports = router;

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