const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.render('contact', null);
});

router.post('/',
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Email format isn\'t correct')
    .notEmpty()
    .withMessage('Email is required'),
  body('message')
    .notEmpty()
    .withMessage('Message is required'),
  (req, res, _next) => {
    const resultErrors = validationResult(req);
    const hasErrors = !resultErrors.isEmpty();
    if (hasErrors) {
      return res.render('contact', {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: resultErrors.errors,
      });
    }

    return res.render('thanks', { message: 'contact will be sent to us' });
  });

module.exports = router;
