console.log('app.js started');
//config
const {client_id} = require('./config/config');
const {client_secret} = require('./config/config');
//node_modules
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const ForgeSDK = require('forge-apis');

var autoRefresh = true; // or false
var scope = ['data:read','data:write','viewables:read'];
var redirect_url = 'https://aec-hackathon-forge.herokuapp.com/viewer';

var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
oAuth2TwoLegged.authenticate().then(function(credentials){ }, function(err){ console.error(err) });

var oAuth2ThreeLegged = new ForgeSDK.AuthClientThreeLegged(client_id, client_secret, redirect_url, scope, autoRefresh);
var AuthUrl = oAuth2ThreeLegged.generateAuthUrl();
console.log('oAuth2ThreeLegged.generateAuthUrl(): ',oAuth2ThreeLegged.generateAuthUrl());
// oAuth2ThreeLegged.getToken(authorizationCode).then(function (credentials) {
//     // The `credentials` object contains an `access_token` and an optional `refresh_token` that you can use to call the endpoints.
// }, function(err){
//     console.error(err);
// });

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
app.get('/login', (req, res) => {  //startPage
  var AuthUrl = oAuth2ThreeLegged.generateAuthUrl();
  res.send(AuthUrl);
});
app.get('/viewer', (req, res) => {  //startPage
  res.render('viewer.hbs');
});
app.get('/getAccessToken', (req, res) => {  //startPage
  res.send(oAuth2TwoLegged.credentials);
});

app.listen(port, () => {
  console.log('Server is running on http://localhost:'+port);
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
