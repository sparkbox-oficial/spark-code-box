const express = require('express');

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.render('contact', null);
});

router.post('/', (req, res, _next) => {
  console.log(req.body);
  res.render('thanks', { message: 'contact will be sent to us' });
});

module.exports = router;
