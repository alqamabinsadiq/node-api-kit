// importing packages
var express = require('express');
var bodyParser = require('body-parser');
let Promotions = require('../models/promotion');
var authenticate = require('../authenticate');
const cors = require('./cors');

var promotions = express.Router();
promotions.use(bodyParser.json());

promotions.route('/')
  // For preflight request the client sends a request to check which type of requests are allowed from this origin.
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  // GET is allowed for all the origins.
  .get(cors.cors, (req, res, next) => {
    Promotions.find({})
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  // Only few origins can use this operation.
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
      .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

promotions.route('/:promId')
  // For preflight request the client sends a request to check which type of requests are allowed from this origin.
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  // GET is allowed for all the origins.
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promId);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotions.findByIdAndUpdate(req.params.promId, {
      $set: req.body
    }, {
        new: true
      })
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => nect(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotions.findByIdAndRemove(req.params.promId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promotions;