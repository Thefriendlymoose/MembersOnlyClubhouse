const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//authentication
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);

const helmet = require('helmet');
const compression = require('compression');
const clubhouseRouter = require('./routes/clubhouse');

require('dotenv').config();

var app = express();

var db_host = process.env.DB_HOST;
var mongoDB = process.env.MONGODB_URI || db_host;
mongoose.connect(mongoDB, {useNewURLParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("failed to connect to database " + err);
    })

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});



app.use('/', clubhouseRouter);


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