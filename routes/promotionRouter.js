const express = require('express');

const promotionRouter = express.Router();
//* this is my main route
promotionRouter.route('/')

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the promotions to you');
})
.post((req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    res.end('Deleting all promotions');
});


promotionRouter.route('/:promotionId')

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`GET Will send details of promotion: ${req.params.promotionId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST not supported on promotion: ${req.params.promotionId}`);
})
.put((req, res) => {
    res.end(`PUT will update promotion: ${req.params.promotionId} Description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`);
});


module.exports = promotionRouter;