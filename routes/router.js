var express = require('express');
var users = require('../features/users/userRouter');
//var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var verify = require('../server/verify');

module.exports = function (app, config, models) {
  var router = express.Router();

  router.use('/users', users);





  app.use('/api', router);
};
