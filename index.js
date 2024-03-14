//using express.js 
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

//converting to json 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//using routes as middleware
app.use(routes);

//once the database is open, start listening.
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server for running on port ${PORT}!`);
  });
});
