var mongoose = require('mongoose');
const {config} = require('../../config/config');

var dbPort = 27017;

// ----CONNESSIONE DB CON AUTH OPTIONS {} ----//
var url1 = `mongodb://${config.mongodb.ip}:${config.mongodb.port}/${config.mongodb.db[0]}`;
var url2 = `mongodb://${config.mongodb.ip}:${config.mongodb.port}/${config.mongodb.db[1]}`;

var options = {
  useMongoClient: true,
  user:config.mongodb.user.name,
  pass:config.mongodb.user.psw
};

mongoose.Promise = global.Promise;
var connection_TimeSheet = mongoose.createConnection(url1,options);
var connection_PeopleData = mongoose.createConnection(url2,options);

module.exports.TimeSheet = connection_TimeSheet;
module.exports.PeopleData = connection_PeopleData;
// Per connessioni multiple o su database differenti: http://mongoosejs.com/docs/connections.html
