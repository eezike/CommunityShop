const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');

var controller = require('./controllers/controller');

const app = express();

//passport config
require("./controllers/db").passportFunction(passport)

//db config
const uri = process.env.MONGO_URL
mongoose.connect(uri, {useNewUrlParser: true}).then(() => console.log("mongoose connected")).catch((err) => console.log(err));


//static files
app.use(express.static('./public'));

//ejs
app.set("view engine", "ejs")

//Express Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//routes
controller(app, passport)

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server listening on port ${PORT}`));