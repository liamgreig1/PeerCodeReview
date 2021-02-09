const cors = require('cors');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

//IMPORTANT for using local host - lets server send data to browser
app.use(cors());

app.listen(port);

console.log('RESTful API server started on: ' + port);