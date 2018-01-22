var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../features/users/userModel');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');
var config = require('../config/config');
const Iron = require('iron');

// Returns the sign jwt
exports.getToken = (user, expiresIn) => {
  return jwt.sign(user, config.secretKey,
    { expiresIn: expiresIn || 3600 });
};

// Check whether the user has admin privileges or not.
exports.verifyAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user.admin) {
    next();
  }
  else {
    var err = new Error(`You are not authorized to perform this operation!`);
    err.status = 403;
    return next(err);
  }
};



exports.verifyUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log("user", user);
    // console.log('err', err);
    // console.log('info', info);
    if (user === false && info && info.message === 'No auth token') {
      // Just unauthorized - nothing serious, so continue normally
      var err = new Error(`No Token Provided`);
      err.status = 403;
      next(err);
    }
    else if (err) {
      throw err;
    }
    else {
      req.user = user;
    }
    next();
  })(req, res, next);
}

exports.unseal = function (req, res, next) {
  Iron.unseal(req.user, config.sealPass, Iron.defaults, function (err, unsealed) {
    if (err) {
      return res.status(500).json({
        message: 'User verification error',
        success: false,
        data: null
      });
    }
    else {
      req.user = unsealed;
      console.log(unsealed);
      next();
    }
  });
};
// exports.verifyUser = passport.authenticate('jwt', { session: false });