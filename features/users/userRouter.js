var express = require('express');
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('./userModel');
var authenticate = require('../../server/authenticate');
const cors = require('../../server/cors');
const userCtrl = require('./userController');
const verify = require('../../server/verify');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
// Only few origins can use this operation.
router.get('/', cors.corsWithOptions, verify.verifyUser, verify.verifyAdmin, userCtrl.listAll);

// Registers User.
router.post('/signup', cors.corsWithOptions, userCtrl.register);

// We don't need to handle the error here because it is already taken care of by 
// passport local mongoose plugin.
router.post('/login', cors.corsWithOptions, userCtrl.login);

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  }
});


router.get('/logout', cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;