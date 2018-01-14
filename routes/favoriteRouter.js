// importing packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    // For preflight request the client sends a request to check which type of requests are allowed from this origin.
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

    // fetches all the favorite dishes of a particular user nad populate the user and dish . 
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favourites) => {
                if (!favourites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(null);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/');
    })

    // Check whether the dishes already exists in the model or not if they exists then generate and error
    // Other wise add them to dishes array.
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (!favorite) {
                    Favorites.create({
                        user: req.user._id,
                        dishes: req.body
                    })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    req.body.map((item) => {
                        if (favorite.dishes.indexOf(item._id) === -1) {
                            favorite.dishes.push(item._id);
                        }
                        else {
                            err = new Error('Dishes ' + item._id + 'already exists.');
                            err.status = 403;
                            return next(err);
                        }
                    })
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Deletes the entire favorite document of a particular user.
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    // For preflight request the client sends a request to check which type of requests are allowed from this origin.
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/' + req.params.dishId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })

    // Check whether the dish exsists in the dishes array, if it exists then 
    // generate an error. Otherwise add it to dishes array.
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favourites) => {
                if (favourites === null) {
                    Favorites.create({
                        user: req.user._id,
                        dishes: [req.params.dishId]
                    })
                        .then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    if (favourites.dishes.indexOf(req.params.dishId) === -1) {
                        favourites.dishes.push(mongoose.Types.ObjectId(req.params.dishId));
                        favourites.save()
                            .then((favourite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourite);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' already exists in favourite dishes.');
                        err.status = 403;
                        return next(err);
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Check whether the dish exsists in the dishes array, if it exists then delete it otherwise 
    // generate an error.
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
                    favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
                    favorite.save()
                        .then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' does not exists in favourite dishes.');
                    err.status = 403;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;