var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./features/users/userModel');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config.js');
// passport.use(new LocalStrategy(here we supply the verify function since we are using passport mongoose
// plugin so we can use authenticate method supplied by it ))
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// This will take care of whatever is reqd for support for sessions in passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Returns the sign jwt
exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey,
    { expiresIn: 3600 });
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

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
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
  }));

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

exports.verifyUser = passport.authenticate('jwt', { session: false });