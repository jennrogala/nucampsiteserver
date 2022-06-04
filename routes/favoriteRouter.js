const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }).catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsite.push(fav._id);
                }
            }); //foreach
            favorite.save()
            .then(favorite => {
                console.log('Favorite(s) Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } //1st if curly bracket
        else {
            Favorite.create({ user: req.user._id, campsites: req.body })
            .then(favorite => {
                console.log('Favorite(s) Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }) //.then
            .catch(err => next(err));
        } //else curly bracket
    }).catch(err => next(err));
} //1st curly bracket
) //1st then
    
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            favorite.remove()
            .then(favorite => {
                console.log('Favorite Deleted ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })  //2nd then
            .catch(err => next(err));
        } //if curly bracket
        else {
            //console.log('No Favorites Yet ');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
            }
    })  //1st then
    .catch(err => next(err));
} //1st curly bracket for delete
); //1st paren for delete  
    
    
    
favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET not supported for favorites');
})

.post(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    Favorite.findOne({ user: req.user._id })    //locate favorites document for user
    .then(favorite => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    //console.log('Campsite added to favorites ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } //if curly bracket
            else {
                //console.log('Already favorited ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('That campsite is already in the list of favorites');
                }
            
        } //if/else curly bracket
        else {
            Favorite.create()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);   
            })
            .catch(err => next(err));
    }
} //1st curly bracket
) //1st then 
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT not supported for favorites');  
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId);    //get index from array for specified campsite
            favorite.campsites.splice(index, 1);    //remove from array
            favorite.save()
            .then(favorite => {
                Favorite.findById(favorite._id)
                .then(favorite => {
                    console.log('Favorite deleted', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }).catch(err => next(err));
        } else {
            res.statuscode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no favorites to delete.');
        }
    }).catch(err => next(err))
});

module.exports = favoriteRouter;