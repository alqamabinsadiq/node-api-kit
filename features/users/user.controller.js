const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('./user.model');
const authenticate = require('../../server/authenticate');
let log = require('tracer').console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
const verify = require('../../server/verify');
let Q = require('q');
const Iron = require('iron');
const config = require('../../config/config');

exports.listAll = (req, res, next) => {
  User.find({}, (err, user) => {
    if (err) throw err;
    res.json(user);
  });
};


exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, (err) => {
      log(err);
      if (err) {
        return res.status(500).json({
          message: 'Could not log in user',
          success: false,
          data: err
        });
      }
      const token = authenticate.getLoginData(user).then((data) => {
        return res.status(200).json({
          message: 'Login successful!',
          success: true,
          token: data
        });
      },
        (err) => {
          return res.status(400).json({
            message: 'Something went wrong while login.',
            success: false,
            data: null
          });
        }).catch((err) => {
          console.log(err);
        })
    });
  })(req, res, next);

};

exports.register = (req, res) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, message: 'Registration Successful!' });
          });
        });
      }
    });
}

exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    let err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
};

exports.facebookAuthentication = (req, res) => {
  if (req.user) {
    Iron.seal(request.user._id, config.sealPass, Iron.defaults, (err, sealed) => {
      if (err) {
        deferred.reject(err);
      }
      let token = verify.getToken({ _id: sealed }, expiry || "30 days");
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    });
  }
};