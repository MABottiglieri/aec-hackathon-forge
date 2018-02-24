$( document ).ready(function(){
  console.log('start viewer');
});
var documntIdWebModel01 = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2NodXJjaF9ob2xlLnppcA'; //church_hole.zip     2017/08/11
var documntIdWebModel02 = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bDIyL2lyb24tbWFuLWhlbG1ldC56aXA'; //iron-man-helmet.zip     2017/08/11

var options = {
    env: 'AutodeskProduction',
    accessToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJMWjA4MTIxbTJFZERNcmxPR2szQURoZzdEd1RSY2w2eiIsImV4cCI6MTUxOTQ0MjA2OCwic2NvcGUiOlsiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsInZpZXdhYmxlczpyZWFkIl0sImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6InBzN3VINkFzRGl6clYxZlRvR3BUZkJJZjNWRTRxTXRWeVJuSTZMeHhkbmtsOENKVlJIcmZjbnFVeFRuQWpHZnoifQ.v8kDmWa9Cv7vigF00eboi7IEVLNOOu8v0WvO-FcfdDc'
};
var viewer;
var documentIds = [
    { "description": "documntIdWebModel01", "urn": documntIdWebModel02 }, // documentId0em, documentIdDEGW01, documentId_People01, documntIdWebModel01, documentId0ezip
    { "description": "documntIdWebModel02", "urn": documntIdWebModel02 },
    { "description": "documntIdWebModel03", "urn": documntIdWebModel02 },
    { "description": "documntIdWebModel04", "urn": documntIdWebModel02 }
];
var CustomGlobalOffset = [
    { x: 0, y: 0, z: 0 },
    { x: 50, y: 50, z: -50 },
    { x: 50, y: 50, z: -50 },
    { x: 0, y: 120, z: 0 }
]; //il segno delle coordinate è contrario alla direzione degli assi visualizzati
var OnDocumentIdLoaded = [
    onLastDocLoaded,  //onDoc0Loaded
    onDoc1Loaded,     //onDoc1Loaded
    onDoc2Loaded,     //onDoc2Loaded
    onLastDocLoaded
];
var documentIndex = 0;
var documentName = documentIds[documentIndex].description;
var allDbIds = [];
var instanceTree = {};
var StoredInstanceTree = [];
var StoredAllDbIds = [];
var searchAttributes = [
    ["System Name"],
    ["System Classification"],
    ["System Type"],
    ["Keynote"],
    ["Material"]
];
var startDate;

var initOptions = Autodesk.Viewing.createInitializerOptions();
initOptions.api = 'modelDerivativeV2';  //DerivativeV2
initOptions.accessToken = options.accessToken;
//initOptions.useConsolidation = true;
//initOptions.consolidationMemoryLimit = 150 * 1024 * 1024; // 150MB - Optional, defaults to 100MB
console.log("initOptions"); console.log(initOptions);

Autodesk.Viewing.Initializer(initOptions, onInitialized); //options

function onInitialized() {
    console.log("VIEWER INITIALIZED");

    var viewerDiv = document.getElementById('MyViewerDiv');
    var config = Autodesk.Viewing.createViewerConfig(); console.log("config"); console.log(config);
    config.extensions.push(
        'Autodesk.InViewerSearch',  //al momento genera una errore in console facendo riferimento alle api v1 (ma funziona)
        'Viewing.Extension.Markup3D',
        'Viewing.Extension.Transform',
        'Autodesk.Viewing.ZoomWindow',
        'Autodesk.Viewing.Collaboration',
        'L22_Tools',
        'L22_CameraViews',
        'L22_Materials'
    );
    config.startOnInitialize = true;
    //config.memory = { limit: 400 }; //limite in MB
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);
    viewer.start();

    //viewer.loadExtension('Viewing.Extension.Transform'); //estensione aggiunta dopo il caricamento del viewer
    //viewer.unloadExtension('Viewing.Extension.Transform'); //estensione rimossa dopo il caricamento del viewer
    ToggleHide('guiviewer3d-toolbar'); //nascosta la barra dei pulsanti Autodesk

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

    StoreModelInstanceTree_AllDbIds(); //necessario StoredAllDbIds[..] per usare i filtri di ricerca

    startDate = new Date; $(".spinner").addClass("Show");

    viewer.model.getBulkProperties(StoredAllDbIds[0], searchAttributes[1], GetPropertiesFilter01, onErrorCallback) //imposta i valori per il filtro "System Classification"
    //viewer.model.getBulkProperties(StoredAllDbIds[0], searchAttributes[3], GetKeynoteFilter01, onErrorCallback) //imposta i valori per il filtro "Keynotes"

    CustomPanel();
    L22MapPanel();
};

function OnObjectTreeCreated() {
    viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, OnObjectTreeCreated);
    console.log("OBJECT_TREE_CREATED_EVENT Doc" + documentIndex + "(" + documentName + ")");

    //console.log("viewer.modelstructure"); console.log(viewer.modelstructure);
};

function onDocumentLoadSuccess(doc) {
    var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), { 'type': 'geometry' }, true); console.log("viewables"); console.log(viewables);
    if (viewables.length === 0) { console.error('Document contains no viewables.'); return; }
    else {
        var path = doc.getViewablePath(viewables[0]); //vista iniziale del Viewer (svfUrl)
        var modelOptions = {
            sharedPropertyDbPath: doc.getPropertyDbPath(),
            globalOffset: CustomGlobalOffset[documentIndex] //azzeramento del GlobalOffset
        }; //setup Model Options
        viewer.loadModel(path, modelOptions);
        //console.log('viewer.utilities'); console.log(viewer.utilities);
        //console.log("Document Loaded(" + documentName + ")");
    };
};
function onDocumentLoadFailure(viewerErrorCode) { console.error("NON E' STATO POSSIBILE CARICARE IL DOCUMENTO - errorCode:" + viewerErrorCode); };

function onSuccessCallback() { console.log("onSuccessCallback()"); };
function onErrorCallback() { console.log("C'E' QUALCOSA CHE NON VA!"); };

function uniqueAndCount(StoredArray, uniqueEl, elCount, prev) {
    StoredArray.sort();

    for (var i = 0; i < StoredArray.length; i++) {
        if (StoredArray[i] !== prev) {
            uniqueEl.push(StoredArray[i]);
            elCount.push(1);
        } else { elCount[elCount.length - 1]++; }
        prev = StoredArray[i];
    };
    console.log("uniqueElements"); console.log(uniqueEl);
    console.log("elementsCount"); console.log(elCount);
};
function HowMuchTime(currentDate, currentText) {
    console.log(currentText + ' execution time: [' + ((new Date()).getTime() - currentDate.getTime()) / 1000 + ' seconds]'); //stampa il tempo di esecuzione del viewer.search
    $(".spinner").removeClass("Show");
};

function GetKeynoteFilter01(result) {
    HowMuchTime(startDate, "GetKeynoteFilter01");

    var SearchFilter = [];  //azzera il contenuto di eventuali ricerche precedenti
    result.forEach(function (e) {
        var value = e.properties[0].displayValue;
        if (value !== "") { SearchFilter.push(value); }
    }); //Split by "," and store single values

    var uniqueElements = [];
    var elementsCount = [];
    var previous = [];
    uniqueAndCount(SearchFilter, uniqueElements, elementsCount, previous);

    $("#KeynoteSelector01").html("");  //annulla il contenuto del KeynoteSelector0n
    $('<option value="default">(Default) All</option>').appendTo('#KeynoteSelector01');
    var i = 0;
    uniqueElements.forEach(function (e) { $('<option value="' + e + '">' + e + ' (' + elementsCount[i] + ')</option>').appendTo('#KeynoteSelector01'); i++ });
};

function GetPropertiesFilter01(result) {
    HowMuchTime(startDate, "GetPropertiesFilter01");

    var SearchFilter = [];  //azzera il contenuto di eventuali ricerche precedenti
    result.forEach(function (e) {
        var values = e.properties[0].displayValue.split(",");
        if (values.length = 1) { SearchFilter.push(values[0]); }
    }); //Split by "," and store single values

    SearchFilter = $.unique(SearchFilter); console.log("System Classification SearchFilter:"); console.log(SearchFilter); //filtra le chiavi uniche e le dispone in ordine alfabetico
    $("#FormSelector01").html("");  //annulla il contenuto del FormSelector0n
    $('<option value="default">(Default) All</option>').appendTo('#FormSelector01');
    SearchFilter.forEach(function (e) { $('<option value="' + e + '">' + e + '</option>').appendTo('#FormSelector01'); });
};
function GetPropertiesFilter02(result) {
    var SearchFilter = [];  //azzera il contenuto di eventuali ricerche precedenti
    console.log("result[0].properties"); console.log(result[0].properties);
    result.forEach(function (e) {
        var values = e.properties[0].displayValue.split(",");
        if (values.length = 1) { SearchFilter.push(values[0]); }
    }); //Split by "," and store single values

    SearchFilter = $.unique(SearchFilter); console.log("SearchFilter:"); console.log(SearchFilter); //filtra le chiavi uniche e le dispone in ordine alfabetico
    $("#FormSelector02").html("");  //annulla il contenuto del FormSelector0n
    $('<option value="default">(Default) All</option>').appendTo('#FormSelector02');
    SearchFilter.forEach(function (e) { $('<option value="' + e + '">' + e + '</option>').appendTo('#FormSelector02'); });

    $("#SearchFilter_02").addClass("Show");
    $("#SearchFilter_03").removeClass("Show");
};
function GetPropertiesFilter03(result) {
    var SearchFilter = [];  //azzera il contenuto di eventuali ricerche precedenti
    result.forEach(function (e) {
        var values = e.properties[0].displayValue.split(",");
        if (values.length = 1) { SearchFilter.push(values[0]); }
    }); //Split by "," and store single values

    //SearchFilter.sort();
    SearchFilter = $.unique(SearchFilter); console.log("SearchFilter:"); console.log(SearchFilter); //filtra le chiavi uniche e le dispone in ordine alfabetico
    $("#FormSelector03").html("");  //annulla il contenuto di FormSelector03
    $('<option value="default">Select one</option>').appendTo('#FormSelector03');
    SearchFilter.forEach(function (e) {
        e = e.split(" ");
        if (e.length == 1) { $('<option value="' + e[0] + '">' + e[0] + '</option>').appendTo('#FormSelector03'); }
        else { console.warn("Codifica non adatta (non deve contenere spazi): " + e[0] + " " + e[1]); }
    });

    $("#SearchFilter_03").addClass("Show");
};

function StoreModelInstanceTree_AllDbIds() {
    var ModelList = viewer.impl.modelQueue().getModels(); //console.log("viewer.impl.modelQueue().getModels()"); console.log(ModelList);
    var i = 0;
    ModelList.forEach(function (model) {
        instanceTree = model.myData.instanceTree;
        StoredInstanceTree.push(instanceTree);
        PushAllDbIds(instanceTree);
        console.log("model[" + i + "] instanceTree and AllDbIds Stored");
        i++;
    });
    console.log("StoredInstanceTree"); console.log(StoredInstanceTree);
    console.log("StoredAllDbIds"); console.log(StoredAllDbIds);
};
function PushInstanceTree() {
    instanceTree = viewer.model.getInstanceTree(); console.log("instanceTree:"); console.log(instanceTree);
    StoredInstanceTree.push(instanceTree);
};
function PushAllDbIds(ChosenInstanceTree) {
    allDbIds = [];
    Object.keys(ChosenInstanceTree.nodeAccess.dbIdToIndex).forEach(function (e) { allDbIds.push(Number(e)); });
    //console.log("allDbIds:"); console.log(allDbIds);
    StoredAllDbIds.push(allDbIds);
};
function SelectButton(ButtonID) {
    console.log("Button selected '#" + ButtonID + "'");
    return document.getElementById(ButtonID).click();
};
function ToggleHide(IdValue) {
    document.getElementById(IdValue).classList.toggle('Hide');
    console.log("ToggleHide activated on '#" + IdValue + "'");
};
function TextReplace() {
    var Button_Text = document.getElementById("SystemBrowser").innerHTML;
    var Button_HTML = event.target.id;
    var Button_NewText = document.getElementById(Button_HTML).innerHTML;
    document.getElementById("SystemBrowser").innerHTML = Button_NewText;
};
function SelectIsolate(elements) {
    viewer.select(elements);
    viewer.isolate(elements);
    viewer.fitToView(elements);
    HowMuchTime(startDate, "viewer.search")
};
function searchIsolate(SearchText, SearchField) {
    startDate = new Date;
    console.log("Isolated elements whose '" + SearchField + "' is:\n'" + SearchText + "'");
    viewer.search('' + SearchText + '', SelectIsolate, onErrorCallback, SearchField);
};
function newFilterProperties(SearchText, SearchField01, SearchField02, OnSuccess) {
    startDate = new Date;
    viewer.search('' + SearchText + '', function (result) {
        console.log("NodesDbIds:"); console.log(result);
        viewer.model.getBulkProperties(result, SearchField02, OnSuccess, onErrorCallback);
        HowMuchTime(startDate, "newFilterProperties");
    }, onErrorCallback, SearchField01);
};
function RefreshSpreadSheet() {
    document.getElementById("TableBody").innerHTML = null;
    LoadSpreadsheetData();
};
function activateTwoSidedRendering() {
    var materials = viewer.impl.matman()._materials;
    //ciclo for per ogni elemento in materials
    for (var matKey in materials) {
        materials[matKey].side = THREE.DoubleSide;
        materials[matKey].needsUpdate = true;
    }
    console.log("materials updated"); console.log(materials);
    viewer.impl.renderer().toggleTwoSided(true);
};
function AnimateViewer(value) {

    //setTimeout(); //setTimeout(fn, 0);
    //setInterval();
    //setImmediate();
    //requestAnimationFrame();

    if (value < 100) { console.log("Animation progress: " + value + "%."); }
    else { console.log("Animation finished."); }
};

function addCustomLight() {
    Autodesk.Viewing.Private.LightPresets.push({
        name: "Lombardini22 Custom Light",
        path: null,
        tonemap: 0,
        E_bias: 0,
        directLightColor: [0, 0.84, 0.67],
        ambientColor: [0.8, 0.9, 1],
        lightMultiplier: 1,
        bgColorGradient: [230, 230, 230, 150, 150, 150],
        darkerFade: !1
    });
    console.log("Lombardini22 Custom light added");
    //to switch to the new light at once.
    viewer.setLightPreset(Autodesk.Viewing.Private.LightPresets.length - 1);
};

function MABTest() {

    var i;
    viewer.dockingPanels.forEach(function (e, index) { if (e.titleLabel == "L22 Docking Panel") { i=index }; });
    var panelVisibility = viewer.dockingPanels[i].isVisible();
    viewer.dockingPanels[i].setVisible(panelVisibility ? false : true);

};
function AltreFunzioniUtili() {
    viewer.modelstructure.setModel(StoredInstanceTree[0]);
    viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.FIRST_OBJECT);
    viewer.setSelectionColor(new THREE.Color(0xFF0000));
    SearchFilter = $.unique(SearchFilter); console.log("System Classification SearchFilter:"); console.log(SearchFilter); //filtra le chiavi uniche e le dispone in ordine alfabetico
    viewer.playAnimation(onSuccessCallback);

    startDate = new Date();
    //console.log(((new Date()).getTime() - startDate.getTime()) / 1000 + ' seconds'); //stampa il tempo di esecuzione del viewer.search

    //console.log("viewer.showModelStructurePanel(true)"); console.log(viewer.showModelStructurePanel(true)); //rende visibile il model browser
    //viewer.setLayersPanel(a);    es    viewer.setLayersPanel(a)
    //setModelStructurePanel(a)  es    viewer.setModelStructurePanel(a)
    //console.log("viewer.getPropertyPanel()"); console.log(viewer.getPropertyPanel());
    //viewer.setPropertyPanel();
    //setPropertiesOnSelect(a)   es    viewer.setPropertiesOnSelect(a)
    //console.log("viewer.getSettingsPanel()"); console.log(viewer.getSettingsPanel());
    //setSettingsPanel(a)    es    viewer.setSettingsPanel(a)
    //console.log("viewer.setUp()"); console.log(viewer.setUp());

    var parentHtml = document.createElement('div');

    // Hide model using id
    viewer.hideModel(model.id);

    // Show model using id
    viewer.showModel(model.id);
    viewer.loadedExtensions;
    viewer.setDisplayEdges(true);
    viewer.showViewCubeTriad(true);
    viewer.utilities;
    viewer.utilities.setPivotSize(2);
    viewer.utilities.setPivotColor(0xFF0000, 1);
    Autodesk.Viewing.Private.LightPresets; // preset di luci per il viewer
};
