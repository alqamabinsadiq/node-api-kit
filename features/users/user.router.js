let express = require('express');
let passport = require('passport');
const bodyParser = require('body-parser');
let User = require('./userModel');
let authenticate = require('../../server/authenticate');
const cors = require('../../server/cors');
const userCtrl = require('./userController');
const verify = require('../../server/verify');
let router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
// Only few origins can use this operation.
router.get('/', cors.corsWithOptions, verify.verifyUser, verify.verifyAdmin, userCtrl.listAll);

// Registers User.
router.post('/signup', cors.corsWithOptions, userCtrl.register);

// Logins the user.
router.post('/login', cors.corsWithOptions, userCtrl.login);

// separate route for facebook oAuth2.
router.get('/facebook/token', passport.authenticate('facebook-token'), userCtrl.facebookAuthentication);

// logouts the user by destroying the session.
router.get('/logout', cors.corsWithOptions, userCtrl.logout);


module.exports = router;