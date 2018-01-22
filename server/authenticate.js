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
Opts containse the information for JwtStrategy, 
which involves where to get the token and what is our secret key 
*/

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    Iron.unseal(jwt_payload._id, config.sealPass, Iron.defaults, function (err, unsealed) {
      console.log(3);
      if (err) {
        return res.status(500).json({
          message: 'User verification error',
          success: false,
          data: null
        });
      }
      else {
        // req.user = unsealed;
        console.log(unsealed);
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
  var userData = user._doc;
  delete userData.hash;
  delete userData.salt;
  delete userData.resetToken;
  delete userData.admin;
  delete userData.firstname;
  delete userData.lastname;
  delete userData.createdAt;
  delete userData.updatedAt;
  delete userData.username;
  delete userData.__v;


  console.log("1", userData);
  var deferred = Q.defer();
  Iron.seal(userData, config.sealPass, Iron.defaults, (err, sealed) => {
    console.log('2');
    if (err) {
      deferred.reject(err);
    }
    console.log(sealed);
    var token = verify.getToken({ _id: sealed }, expiry || "30 days");
    deferred.resolve(token);
  });
  return deferred.promise;
};

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

// exports.verifyUser = passport.authenticate('jwt', { session: false });