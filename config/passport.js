var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var CustomStrategy = require('passport-custom');
var User = require('../models/user');
var configAuth = require('./auth');
var speakeasy = require('speakeasy')

//For speakeasy
function getToken(secret) {
    return speakeasy.time({secret: secret, encoding: 'base32'})
  }
  
function verifyToken(secret, token) {
    return speakeasy.time.verify({secret: secret, encoding: 'base32', token: token})
  }


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    process.nextTick(function () {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, {message: 'Email is already taken.'});
            }
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.local.username = req.body.username;
			newUser.local.cnName = req.body.cnName;
            newUser.save(function (err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    });
}));


passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));




passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    profileFields: ['id', 'displayName', 'email'], 
    callbackURL: configAuth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            User.findOne({'local.facebook.id': profile.id}, function(err, user){
                if(err)
                     return done(err);
                if(user)
                       return done(null, user);
                else {
                     console.log(profile);
                    var newUser = new User();
                    newUser.local.facebook.id = profile.id;
                    newUser.local.facebook.token = accessToken;
                    newUser.local.facebook.name = profile.displayName;
                    newUser.local.facebook.email = profile.emails[0].value;

                      newUser.save(function(err){
                         if(err)
                            throw err;
                        return done(null, newUser);
                    })
                 }
             });
         });
     }
   ));

   //改變profile資料
   passport.use('profile.edit', new CustomStrategy(
    function(req, done) {
        process.nextTick(function () {
            User.findOne({'local.email': req.user.local.email}, function (err, user) {
                if (err) {
                    console.log(User);
                    return done(err);
                }
                if (user) {
                    user.local.username = req.body.username;
                    user.local.cnName = req.body.cnName;
                    user.save(function (err, result) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, user);
                    });
                }
            });
        });
    }
  ));
 passport.use('test', new CustomStrategy(
     function(req, done) {
         User.findOne({'local.email': req.user.local.email}, function(err, user){
             if (err) return err;
             if (user){
                var test = new User;
                test = { _id: 12345689,
                    __v: 0,
                    local:
                     { cnName: '123',
                       username: '2134',
                       password: '$2a$05$y97CvfIQe1aWCsewekcDs.YFliy8LjZfqOXcWhxJmnPjLOsOAlxi.',
                       email: '1234@1234' } }
                test.save(function (err){
                    if (err) return err;
                });
                user.local.username = req.body.username;
                user.local.cnName = req.body.cnName;
                console.log(user)
                user.save(function (err, result) {
                    if (err) {
                        return err;
                    }
                    return result;
                });
             }
         })
     }
 ))

//google authenticator
passport.use('local.googleauth', new CustomStrategy(
    function (req, done) {
        process.nextTick(function () {
            User.findOne({'local.email': req.user.local.email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!verifyToken(user.local.googleAuthenticatorSecret, req.body.token)){
                    console.log('here3?')
                    return done(null, false, {message: 'Wrong token.'})
                }
                return done(null, user);
            });
        });
}));