# aec-hackathon-forge
Forge Viewer for AEC Hackathon 5.0 San Francisco Bay Area

### **"config/config.js"**
set your personal **"client_id"** and **"client_secret"** displayed on your Forge Application

var **ForgeApp** = {

  client_id:"**YOUR-CLIENTID**",
  
  client_secret:"**YOUR-CLIENTIDSECRET**"
  
};

### **"public/js/viewer.js"**
replace urns with the addres of your translated model

var **documentIds** = [

{ "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },

{ "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },

{ "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' },

{ "description": "iron-man-helmet", "urn": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA' }

];

this is a test to load multiple models, if you have only one available you can copy/paste the same urn in every slot

you can set the global offset for placing your models in the viewer by seyying up "CustomGlobalOffset"

var **CustomGlobalOffset** = [
    { x: 0, y: 0, z: 0 },
    { x: 100, y: 0, z: 100 },
    { x: -100, y: 0, z: 100 },
    { x: 0, y: 0, z: 200 }
];

