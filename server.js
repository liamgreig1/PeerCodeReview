const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

require('./api/models/model'); //created model loading here

// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//IMPORTANT for using local host - lets server send data to browser
app.use(cors());

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(3000);

//Deals with any unknown routes 
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

module.exports = app;