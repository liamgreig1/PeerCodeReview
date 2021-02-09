const cors = require('cors');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  Task = require('./api/models/model'), //created model loading here
  bodyParser = require('body-parser');

//IMPORTANT for using local host - lets server send data to browser
app.use(cors());

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/flights'); 
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(port);

//Deals with any unknown routes 
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

console.log('RESTful API server started on: ' + port);