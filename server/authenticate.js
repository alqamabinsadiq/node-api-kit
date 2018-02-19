let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../features/users/user.model');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let FacebookTokenStrategy = require('passport-facebook-token');
let Q = require('q');
const Iron = require('iron');
const verify = require('./verify');
let config = require('../config/config');
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

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    Iron.unseal(jwt_payload._id, config.sealPass, Iron.defaults, (err, unsealed) => {
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
  let userData = user._doc._id;
  let deferred = Q.defer();
  // Encrypt the data using iron.
  Iron.seal(userData, config.sealPass, Iron.defaults, (err, sealed) => {
    if (err) {
      deferred.reject(err);
    }
    // generate the jwt for the encrypted data.
    let token = verify.getToken({ _id: sealed }, expiry || "30 days");
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