let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../features/users/userModel');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let FacebookTokenStrategy = require('passport-facebook-token');
let config = require('../config/config');
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
    let err = new Error(`You are not authorized to perform this operation!`);
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
      let err = new Error(`No Token Provided`);
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

// Unseal the data which was encrypted using iron npm module.
exports.unseal = (req, res, next) => {
  Iron.unseal(req.user, config.sealPass, Iron.defaults, (err, unsealed) => {
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