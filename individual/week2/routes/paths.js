const routes = require('express').Router();
const controller = require('../controllers/controllers');

routes.get('/', controller.index);
routes.get('/home', controller.homepage);

module.exports = routes;