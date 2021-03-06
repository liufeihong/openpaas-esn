'use strict';

var express = require('express');

module.exports = function(dependencies) {

  var authorizationMW = dependencies('authorizationMW');
  var controller = require('./controller')(dependencies);

  var router = express.Router();

  router.get('/accounts', authorizationMW.requiresAPILogin, controller.getAccounts);
  router.delete('/accounts/:id', authorizationMW.requiresAPILogin, controller.deleteAccount);

  return router;
};
