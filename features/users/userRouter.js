var express = require('express');
var passport = require('passport');
const bodyParser = require('body-parser');
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

// logouts the user by destroying the session.
router.get('/logout', cors.corsWithOptions, userCtrl.logout);


module.exports = router;