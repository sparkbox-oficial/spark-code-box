const express = require('express');

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.render('sign-up', { title: 'tadeu' });
});

module.exports = router;
