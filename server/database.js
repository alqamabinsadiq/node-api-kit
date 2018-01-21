const config = require('../config/config');
const mongoose = require('mongoose');
const log = require('tracer').console({ format: "{{message}}  - {{file}}:{{line}}" }).log;

exports.connect = () => {
  // Connection URL
  const url = config.mongoUrl;
  const connect = mongoose.connect(url, {
    useMongoClient: true,
    /* other options */
  });

  connect.then((db) => {
    log("MongoDB connected on " + config.mongoUrl);
    log("###########################################################################");
  }, (err) => { console.log(err); });

}
