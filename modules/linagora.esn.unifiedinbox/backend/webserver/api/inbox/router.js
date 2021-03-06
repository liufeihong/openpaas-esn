'use strict';

const express = require('express');

module.exports = dependencies => {
  const router = express.Router(),
        auth = dependencies('authorizationMW');

  router.post('/api/inbox/sendemail', auth.requiresAPILogin, require('./sendEmail')(dependencies).sendEmailToRecipients);
  router.use('/api/inbox/', require('./identities')(dependencies));

  return router;
};
