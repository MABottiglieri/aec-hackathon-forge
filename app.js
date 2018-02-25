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
const base64url = require('base64-url');

var BucketsApi = new ForgeSDK.BucketsApi();
var ObjectsApi = new ForgeSDK.ObjectsApi();
var DerivativesApi = new ForgeSDK.DerivativesApi();

const port = process.env.PORT || 3000;
hbs.registerPartials(__dirname + '/views/partials');

var app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({"extended":true}));
app.use(fileUpload());

app.get('/',(req,res) =>{  // app info
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
app.get('/viewer', (req, res) => {  // startPage
  res.render('viewer.hbs');
});

app.get('/getAccessToken', (req, res) => {  // getAccessToken
  var autoRefresh = true; // or false
  var scope = ['data:read','data:write','viewables:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    res.send(credentials);
  }, function(err){ console.error(err); res.send(err) });
});
app.get('/getBuckets', (req, res) => {  // getBuckets
  var autoRefresh = true; // or false
  var scope = ['bucket:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    BucketsApi.getBuckets({}, oAuth2TwoLegged, credentials).then(function(buckets){
      res.send(buckets);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.get('/getObjects/:bucketKey', (req, res) => {  // getObjects
  var bucketKey = req.params.bucketKey; //console.log(bucketKey);
  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    options = {limit:100}; // default 10, can be 1-100
    ObjectsApi.getObjects(bucketKey, options, oAuth2TwoLegged, credentials).then(function(objects){
      res.send(objects);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/getThumbnail', (req, res) => {  // getThumbnail
  var objectId = req.body.objectId; //console.log('objectId: ',objectId);
  var urn = base64url.encode(objectId); //console.log('urn: ',urn);
  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getThumbnail(urn, {}, oAuth2TwoLegged, credentials).then(function(object){
      res.send(object);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/jobTranslate', (req, res) => {  // jobTranslate
  var objectId = req.body.objectId; //console.log('objectId: ',objectId);
  var urn = base64url.encode(objectId); //console.log('urn: ',urn);
  var job = {
    input:{
      urn:urn,
      compressedUrn:false, // Set this to `true` if the source file is compressed. If set to `true`, you need to define the `rootFilename`
      rootFilename:undefined // The root filename of the compressed file. Mandatory if the `compressedUrn` is set to `true`.
    },
    output:{
      destination:{region:'emea'},
      formats:[{type:'svf',views:['2d','3d']}]
    }
  };
  var autoRefresh = true; // or false
  var scope = ['data:read','data:write'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    var options = {xAdsForce:true}; // if `true`: the endpoint replaces previously translated output file types with the newly generated
    DerivativesApi.translate(job, options, oAuth2TwoLegged, credentials).then(function(job){
      res.send(job);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/getManifest', (req, res) => {  // getManifest
  var objectId = req.body.objectId; //console.log('objectId: ',objectId);
  var urn = base64url.encode(objectId); //console.log('urn: ',urn);
  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getManifest(urn,{}, oAuth2TwoLegged, credentials).then(function(manifest){
      res.send(manifest);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/getMetadata', (req, res) => {  // getMetadata
  var objectId = req.body.objectId; //console.log('objectId: ',objectId);
  var urn = base64url.encode(objectId); //console.log('urn: ',urn);
  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getMetadata(urn,{}, oAuth2TwoLegged, credentials).then(function(metadata){
      res.send(metadata);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/getModelviewMetadata', (req, res) => {  // getModelviewMetadata
  var objectId = req.body.objectId;
  var guid = req.body.guid;
  var urn = base64url.encode(objectId);

  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getModelviewMetadata(urn, guid, {}, oAuth2TwoLegged, credentials).then(function(metadata){
      res.send(metadata);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.post('/getModelviewProperties', (req, res) => {  // getModelviewProperties
  var objectId = req.body.objectId;
  var guid = req.body.guid;
  var urn = base64url.encode(objectId);

  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getModelviewProperties(urn, guid, {}, oAuth2TwoLegged, credentials).then(function(metadata){
      res.send(metadata);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
});
app.get('/getFormats', (req, res) => {  // getFormats
  var autoRefresh = true; // or false
  var scope = ['data:read'];
  var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
  oAuth2TwoLegged.authenticate().then(function(credentials){
    DerivativesApi.getFormats({}, oAuth2TwoLegged, credentials).then(function(formats){
      res.send(formats);
    }, function(err){ console.error(err); res.send(err); });
  }, function(err){ console.error(err); res.send(err); });
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
