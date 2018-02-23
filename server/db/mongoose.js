var mongoose = require('mongoose');

var dbPort = 27017;
var dbPath = `localhost:${dbPort}`; // localhost
// var dbPath = `151.0.248.134:${dbPort}`; // Lombardini22
var dbName = 'TimeSheet';
var MongoLocalPath = process.env.MONGODB_URI || `mongodb://${dbPath}/${dbName}`;
// var MongoLocalPath = `mongodb://${Lombardini22Path}/${dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(MongoLocalPath);

module.exports = {mongoose};
