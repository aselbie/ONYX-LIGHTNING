'use strict';

var express = require('express');
var controller = require('./news.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/upvote/:id', controller.upvote);
router.put('/downvote/:id', controller.downvote);

module.exports = router;