const express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
const app = express();
const { dirname } = require('path');
const port = process.env.PORT || 4000;


const path = require('path');

// CORS , to give access 
app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.use('/data', express.static(__dirname + './build/contracts'));
app.use('/static', express.static(path.join(__dirname, '../build/contracts')));




app.listen(port, () => console.log(`Listening on port ${port}`));