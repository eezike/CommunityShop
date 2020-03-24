var express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const session = require("express-session");
const passport = require("passport");


var controller = require('./controllers/controller');

//Passport Config
require('./controllers/db').passportFunction(passport);

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Express Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//set up template engine
app.set('view engine', 'ejs')

//static files
app.use(express.static('./public'));

//fire controllers
controller(app, passport);

//listen to port
app.listen(3000);
console.log("Listening on port 3000");