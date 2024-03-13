var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jquery = require('jquery');
var flash = require('connect-flash');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recordRouter = require('./routes/record');
var fileRouter = require('./routes/files');
var publicDir = require('path').join(__dirname, '/public');

const bodyParser = require('body-parser');

var app = express();
app.use(express.static(publicDir));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('images'));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/record', recordRouter);
app.use('/files', fileRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', function (req, res) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
    { name: 'Tux', organization: "Linux", birth_year: 1996 },
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

// about page
app.get('/about', function (req, res) {
  res.render('pages/about');
});

app.get('/create/:name.:pswd', function (req, res) {
  res.render('pages/create');
  console.log(req.params);
});



app.get('/delete', function (req, res) {
  res.render('pages/delete');
});

app.get('/update', function (req, res) {
  res.render('pages/update');
});


app.post('/get-states-by-country', function (req, res) {
  dbConnect
    .collection('cities')
    .find({ "country_id": 1 })
    .limit(50)
    .toArray(function (err, rows, fields) {
      if (err) {
        res.json({
          msg: 'error'
        });
      } else {
        res.json({
          msg: 'success',
          states: rows
        });
      }
    });
});

module.exports = app;
