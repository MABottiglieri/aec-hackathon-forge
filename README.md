# aec-hackathon-forge
Forge Viewer for AEC Hackathon 5.0 San Francisco Bay Area

before running the code, you need to set your personal "client_id" and "client_secret" displayed on your Forge Application

1) Open the "config/config.js" file
var ForgeApp = {
  client_id:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", //your client_id
  client_secret:"xxxxxxxxxxxxxxxx" //your client_secret
};

2) Open the "public/js/viewer.js" file, replace urns with the addres of your translated model
var documentIds = [
    { "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },
    { "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },
    { "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },
    { "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' }
];

this is a test to load multiple models, if you have only one available you can copy/paste the same in every slot

in the same "viewer.js" you can set the global offset for placing your models in the viewer
var CustomGlobalOffset = [
    { x: 0, y: 0, z: 0 },
    { x: 100, y: 0, z: 100 },
    { x: -100, y: 0, z: 100 },
    { x: 0, y: 0, z: 200 }
];

