var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../features/users/userModel');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');
var Q = require('q');
const Iron = require('iron');
const verify = require('./verify');
var config = require('../config/config');
// passport.use(new LocalStrategy(here we supply the verify function since we are using passport mongoose
// plugin so we can use authenticate method supplied by it ))
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// This will take care of whatever is reqd for support for sessions in passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* 
Opts contains the information for JwtStrategy, 
which involves where to get the token and what is our secret key 
*/

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    Iron.unseal(jwt_payload._id, config.sealPass, Iron.defaults, function (err, unsealed) {
      if (err) {
        return res.status(500).json({
          message: 'User verification error',
          success: false,
          data: null
        });
      }
      else {
        User.findOne({ _id: unsealed }, (err, user) => {
          if (err) {
            return done(err, false);
          }
          else if (user) {
            return done(null, user);
          }
          else {
            return done(null, false);
          }

        });
      }
    });
  }
));


exports.getLoginData = (user, expiry) => {
  var userData = user._doc._id;
  var deferred = Q.defer();
  // Encrypt the data using iron.
  Iron.seal(userData, config.sealPass, Iron.defaults, (err, sealed) => {
    if (err) {
      deferred.reject(err);
    }
    // generate the jwt for the encrypted data.
    var token = verify.getToken({ _id: sealed }, expiry || "30 days");
    deferred.resolve(token);
  });
  return deferred.promise;
};

// Facebook
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookId: profile.id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (!err && user !== null) {
      return done(null, user);
    }
    else {
      user = new User({ username: profile.displayName });
      user.facebookId = profile.id;
      user.firstname = profile.name.givenName;
      user.lastname = profile.name.familyName;
      user.save((err, user) => {
        if (err)
          return done(err, false);
        else
          return done(null, user);
      })
    }
  });
}
));