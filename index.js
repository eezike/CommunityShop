var express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');


var controller = require('./controllers/controller');


var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//set up template engine
app.set('view engine', 'ejs')

//static files
app.use(express.static('./public'));

//fire controllers
controller(app);

//listen to port
app.listen(3000);
console.log("Listening on port 3000");