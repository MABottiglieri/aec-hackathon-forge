console.log('starting viewer');
var initOptions = Autodesk.Viewing.createInitializerOptions();
var viewer;

var documentIds = [
    { "description": "xxxxxx", "urn": 'urn:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    { "description": "xxxxxx", "urn": 'urn:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    { "description": "xxxxxx", "urn": 'urn:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    { "description": "xxxxxx", "urn": 'urn:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }
];
var CustomGlobalOffset = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 }
];
var documentIndex = 0;
var OnDocumentIdLoaded = [
    onDoc0Loaded, //onDoc0Loaded
    onLastDocLoaded, //onDoc1Loaded
    onDoc2Loaded,  //onDoc2Loaded
    onLastDocLoaded
];
var documentName = documentIds[documentIndex].description;
var allDbIds = [];
var instanceTree = {};
var startDate;

$( document ).ready(function(){
  $('#viewer-extension-collaborate').attr('onClick','toggleViewerExtension(this.id,"Autodesk.Viewing.Collaboration","load")');
  $('#viewer-extension-markup3D').attr('onClick','toggleViewerExtension(this.id,"Viewing.Extension.Markup3D","load")');
  $('#viewer-extension-translate').attr('onClick','toggleViewerExtension(this.id,"Viewing.Extension.Transform","load")');

  getAccessToken(function(credentials){
    initOptions.accessToken = credentials.access_token;
    initOptions.api = 'modelDerivativeV2'; console.log("initOptions: ", initOptions); //DerivativeV2
    //initOptions.useConsolidation = true;
    //initOptions.consolidationMemoryLimit = 150 * 1024 * 1024; // 150MB - Optional, defaults to 100MB
    Autodesk.Viewing.Initializer(initOptions, onInitialized); //options
  });
});
function onInitialized() {
    console.log("viewer inizialized");
    var viewerDiv = document.getElementById('MyViewer');
    var config = Autodesk.Viewing.createViewerConfig(); console.log("config :",config);
    config.extensions.push('Autodesk.Viewing.ZoomWindow');
    config.startOnInitialize = true;
    //config.memory = { limit: 400 }; //limite in MB
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);
    viewer.start();
    Autodesk.Viewing.Document.load(documentIds[documentIndex].urn, onDocumentLoadSuccess, onDocumentLoadFailure, null);
    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, OnDocumentIdLoaded[documentIndex]);
};

function onDoc0Loaded() {
    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onDoc0Loaded);
    console.log("GEOMETRY_LOADED_EVENT (onDoc0Loaded) (" + documentName + ")");
    documentIndex = documentIndex + 1;
    documentName = documentIds[documentIndex].description;
    Autodesk.Viewing.Document.load(documentIds[documentIndex].urn, onDocumentLoadSuccess, onDocumentLoadFailure);

    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, OnDocumentIdLoaded[documentIndex]);
};
function onDoc1Loaded() {
    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onDoc1Loaded);
    console.log("GEOMETRY_LOADED_EVENT (onDoc1Loaded) (" + documentName + ")");
    documentIndex = documentIndex + 1;
    documentName = documentIds[documentIndex].description;
    Autodesk.Viewing.Document.load(documentIds[documentIndex].urn, onDocumentLoadSuccess, onDocumentLoadFailure);

    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, OnDocumentIdLoaded[documentIndex]);
};
function onDoc2Loaded() {
    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onDoc2Loaded);
    console.log("GEOMETRY_LOADED_EVENT (onDoc2Loaded) (" + documentName + ")");
    documentIndex = documentIndex + 1;
    documentName = documentIds[documentIndex].description;
    Autodesk.Viewing.Document.load(documentIds[documentIndex].urn, onDocumentLoadSuccess, onDocumentLoadFailure);

    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, OnDocumentIdLoaded[documentIndex]);
};
function onLastDocLoaded() {
    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onLastDocLoaded);
    console.log("GEOMETRY_LOADED_EVENT (onLastDocLoaded) (" + documentName + ")");
    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    startDate = new Date; $(".spinner").addClass("Show");
    activateTwoSidedRendering();
};

function OnObjectTreeCreated() {
    viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    console.log("OBJECT_TREE_CREATED_EVENT Doc" + documentIndex + "(" + documentName + ")");
    console.log("viewer.modelstructure: ",viewer.modelstructure);
};

function onDocumentLoadSuccess(doc) {
    var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), { 'type': 'geometry' }, true); console.log("viewables: ",viewables);
    if (viewables.length === 0) { console.error('Document contains no viewables.'); return; }
    else {
        var path = doc.getViewablePath(viewables[0]); //vista iniziale del Viewer (svfUrl)
        var modelOptions = {
            sharedPropertyDbPath: doc.getPropertyDbPath(),
            globalOffset: CustomGlobalOffset[documentIndex] //azzeramento del GlobalOffset
        }; //setup Model Options
        viewer.loadModel(path, modelOptions);
        console.log('viewer.utilities: ',viewer.utilities);
        console.log("Document Loaded(" + documentName + ")");
    };
};
function onDocumentLoadFailure(viewerErrorCode) { console.error("wasn't possible load the document - errorCode:" + viewerErrorCode); };

function getAccessToken(callback){
  $.get('/getAccessToken', function(options) {
    callback(options)
  },'json');
};
function toggleViewerExtension(buttonId,extension,action){
  switch (action) {
    case 'load':
      viewer.loadExtension(extension);
      $('#'+buttonId).attr('onClick','viewer.unloadExtension("'+extension+'"); toggleViewerExtension(this.id,"'+extension+'","unload")');
      break;
    case 'unload':
      viewer.unloadExtension(extension);
      $('#'+buttonId).attr('onClick','viewer.loadExtension("'+extension+'"); toggleViewerExtension(this.id,"'+extension+'","load")');
      break;
  };
}
function activateTwoSidedRendering() {
    var materials = viewer.impl.matman()._materials;
    for (var matKey in materials) {
        materials[matKey].side = THREE.DoubleSide;
        materials[matKey].needsUpdate = true;
    }; console.log("materials updated: ",materials);

    viewer.impl.renderer().toggleTwoSided(true);
};
// $.post('/updateRecord', recordToUpdate, function(response) {
//   console.log("response: ",response);
// },'json');

// $.getJSON( "/getRecords", function( response ) {
//   console.log("response: ",response);
// });
