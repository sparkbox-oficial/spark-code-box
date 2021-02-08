const createError = require('http-errors');
const express = require('express');
const hbs = require('express-handlebars');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const contactRouter = require('./routes/contact');
const loginRouter = require('./routes/login');

const app = express();

// Handlebars setup
app.engine('hbs', hbs({
  extname: 'hbs',
  helpers: {
    toJSON: (obj) => {
      try {
        return JSON.stringify(obj);
      } catch (err) {
        console.error(err);
        return '> it was not possible to convert it <';
      }
    },
  },
  partialsDir: path.join(__dirname, 'views', 'partials'),
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'default',
}));
app.set('views', path.join(__dirname, 'views'));
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
      urlData: req._parsedOriginalUrl,
    }, cb);
  };
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/login', loginRouter);

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
