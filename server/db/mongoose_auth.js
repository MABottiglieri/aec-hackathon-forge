var mongoose = require('mongoose');

var dbPort = 27017;
var dbPath = `localhost:${dbPort}`; // oppure var dbPath =`151.0.248.134:${dbPort}`;
var dbName = 'TimeSheet';
var dbUser = "userTimesheet";

//----CONNESSIONE DB CON AUTH OPTIONS {} ----//
var url = process.env.MONGODB_URI || `mongodb://${dbPath}/${dbName}`; //aggiunto process.env.MONGODB_URI || se non funziona rimuoverlo 2017-12-22
var options = {
  useMongoClient: true,
  user:dbUser,
  pass:"user.timesheet.l22"
};

mongoose.Promise = global.Promise;
mongoose.connect(url,options); //CONNESSIONE DB CON OPTIONS {}

module.exports = {mongoose};

// Per connessioni multiple o su database differenti: http://mongoosejs.com/docs/connections.html
