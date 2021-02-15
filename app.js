const createError = require('http-errors');
const express = require('express');
const hbs = require('express-handlebars');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./src/config');
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const contactRouter = require('./src/routes/contact');
const loginRouter = require('./src/routes/login');
const signUpRouter = require('./src/routes/sign-up');

mongoose.connect(config.db.connString, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
global.User = require('./src/models/user');

const app = express();

// Handlebars setup
app.engine('hbs', hbs({
  extname: 'hbs',
  helpers: {
    equal: (a, b) => a === b,
    toJSON: (obj) => {
      try {
        return JSON.stringify(obj);
      } catch (err) {
        console.error(err);
        return '> it was not possible to convert it <';
      }
    },
  },
  partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
  layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
  defaultLayout: 'default',
}));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * This middleware will add default options in all render function
 */
app.use((req, res, next) => {
  const previousRender = res.render;
  res.render = function render(view, options, cb) {
    previousRender.call(this, view, {
      ...options,
      actualUrl: req.originalUrl,
    }, cb);
  };
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);
app.use('/sign-up', signUpRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
