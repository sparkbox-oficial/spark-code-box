const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, _next) => {
  res.render('index', { title: 'tadeu' });
});

module.exports = router;
