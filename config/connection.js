//importing connect and connection moudules from mongoose 
const { connect, connection } = require('mongoose');

//connection with a collection named socialDB
const connectionString = 'mongodb://127.0.0.1:27017/socialDB';

//connect to the address
connect(connectionString);

module.exports = connection;
