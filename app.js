var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const {DateTime, Duration} = require("luxon");
const humanizeDuration = require("humanize-duration");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MONGOOSE CONNECTION SETUP
//Set up default mongoose connection
var mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

function average(values) {
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length) || 0;
}

function median(values){
  if(values.length ===0) return 0;
  values.sort(function(a,b){
    return a-b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2)
    return values[half];
  return (values[half - 1] + values[half]) / 2.0;
}

// pass luxon's DateTime to pug
app.use(function (req, res, next) {
  res.locals = {
    luxonDateTime: DateTime,
    luxonDuration: Duration,
    formattedDuration: t => humanizeDuration(t, { language: "fr", units: ['y', 'mo', 'w', 'd', 'h', 'm'], round: true }),
    calcMedian: median,
    calcAverage: average
  };
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
