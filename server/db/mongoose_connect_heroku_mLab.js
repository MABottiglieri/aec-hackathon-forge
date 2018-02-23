var mongoose = require('mongoose');

var dbPort = 27017;
var dbPath = `localhost:${dbPort}`; // oppure var dbPath =`151.0.248.134:${dbPort}`;
var dbUser = "userTimesheet";

var MongoPath = process.env.MONGODB_URI || "mongodb://heroku_15b1tm65:heroku_15b1tm65@ds249005.mlab.com:49005/heroku_15b1tm65";
mongoose.Promise = global.Promise;
mongoose.connect(MongoPath);

module.exports = {mongoose};
// Per connessioni multiple o su database differenti: http://mongoosejs.com/docs/connections.html
