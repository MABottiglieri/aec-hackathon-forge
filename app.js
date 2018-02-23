console.log('app.js started');
//config
const {clientId} = require('./config/config'); console.log('clientId ',clientId);
const {secretKey} = require('./config/config'); console.log('secretKey ',secretKey);
//node_modules
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

/*
//var {mongoose} = require('./server/db/mongoose');
//var {mongoose} = require('./server/db/mongoose_auth');
var mongoose = require('./server/db/mongoose_multiConnect');
// var {mongoose} = require('./server/db/mongoose_connect_heroku_mLab');

//Forge collection schemas
var {configDocumentSchema} = require('./server/models/TimeSheet/configDocument');
var {recordSchema} = require('./server/models/TimeSheet/record');
//Forge collection models (mongoose_multiConnect)
var configDocument = mongoose.TimeSheet.model('configs', configDocumentSchema);
var record = mongoose.TimeSheet.model('records', recordSchema);
*/

const port = process.env.PORT || 3000;
hbs.registerPartials(__dirname + '/views/partials');

var app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({"extended":true}));
app.use(fileUpload());

app.get('/',(req,res) =>{
  console.log("app working");
  var appPackage = JSON.parse(fs.readFileSync('./package.json'));
  res.send({
    status:"app working",
    name: appPackage.name,
    version: appPackage.version,
    descriptiopn: appPackage.description,
    message: "Developed by Manuel André Bottiglieri, 2018",
    startPage:"/viewer"
  });
});

app.get('/viewer', (req, res) => {  //startPage
  res.render('viewer.hbs',{
    userName: user[0].name+" "+user[0].surname,
    area: user[0].area,
    userId: user[0].userId,
    userRole: user[0].userRole,
    userCompany: user[0].company,
    imageProfile: user[0].imageProfile,
    localApp:config.localApp.path
  });
});

function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
};
