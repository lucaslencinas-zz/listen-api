const express = require('express');
const bodyParser = require('body-parser');
const errorMiddleware = require('../middlewares/errorMiddleware');
const authenticationController = require('../controllers/authenticationController');
const songsController = require('../controllers/songsController');

module.exports = express
  .Router().use('/api', express
    .Router()
    .use(bodyParser.json())
    .use(authenticationController)
    .get('/songs', songsController.list)
    .get('/songs/:songId', songsController.get)
    .use(errorMiddleware));
