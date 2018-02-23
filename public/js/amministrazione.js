var TimeSheetUsers = {
  attivi:[],
  ritardatari:[],
  inSospeso:[]
};

$( document ).ready(function(){
  console.log('start amministrazione');
  getEmailNotificationConfig();
});

function updateBadges(){
  $.getJSON( '/uncompleteUsers', function( uncompleteUsers ) { // console.log("result: ",uncompleteUsers);
    var uncompleteCount = (uncompleteUsers.count)-(uncompleteUsers.disabledUserIds.length);
    if(uncompleteCount==0){ setBadge('#badge-utenti-inSospeso',"") }
    else { setBadge('#badge-utenti-inSospeso',uncompleteCount) };
    TimeSheetUsers.inSospeso = uncompleteUsers.emailNotFound;
    TimeSheetUsers.inSospesoDisabled = uncompleteUsers.disabledUserIds;

    $.getJSON( '/getJobs/LOMBA', function( jobsLomba ) {
      $.getJSON( '/getJobs/FUD01', function( jobsFud ) {
        var jobsCount = jobsLomba.count+jobsFud.count;
        if(jobsCount==0){ setBadge('#badge-commesse',"") }
        else { setBadge('#badge-commesse',jobsCount) };
      });
    });

    $.getJSON( '/getNewRecords', function( newRecords ) { // console.log("result: ",newRecords);
      if(newRecords.count==0){ setBadge('#badge-nuoviRecord',"") }
      else { setBadge('#badge-nuoviRecord',newRecords.count) };
    });

    $.getJSON( '/users', function( users ) { // console.log("result: ",users);
      var activeCount = (users.count)-(users.disabledUserIds.length);
      if(activeCount==0){ setBadge('#badge-utenti-attivi',"") }
      else { setBadge('#badge-utenti-attivi',activeCount) };
      setBadge('#badge-utenti',activeCount+uncompleteCount);
      TimeSheetUsers.attivi = users.docs;
      TimeSheetUsers.attiviDisabled = users.disabledUserIds;
    });

    $.getJSON( '/laggerUsers', function( users ) { // console.log("result: ",users);
      var laggerCount = (users.count)-(users.disabledUserIds.length);
      if(laggerCount==0){ setBadge('#badge-utenti-ritardatari',"") }
      else { setBadge('#badge-utenti-ritardatari',laggerCount) };
      TimeSheetUsers.ritardatari = users.docs;
      TimeSheetUsers.ritardatariDisabled = users.disabledUserIds;
      $('#config-email-disabled')[0].checked = users.emailAutomation;
      switch (users.emailAutomation) {
        case true: $('#config-email-lag').attr('disabled',false); break;
        case false: $('#config-email-lag').attr('disabled',true); break;
      }
    });
  });
};
function aggiornaStoricoDatiAdHoc(utente){
  var element = $('#modal-users-header-table');
  console.log(localApp+'storeAdHocRecords/powerbi/POWERBI_ORE_COMMESSE/'+utente);
  $.getJSON( localApp+'storeAdHocRecords/powerbi/POWERBI_ORE_COMMESSE/'+utente, function( result ) {
    var thisMessage = "storico dati aggiornato per l'utente: "+utente+", elementi sincronizzati: "+result.storedRecords;
    getSuccessAlert(element,thisMessage,'prepend');
    $('#aggiorna-dati-'+utente).toggle();
  });
};
function aggiornaStoricoDatiJobsAdhoc(){
  var element = $('#importa-commesse');
  var theseJobs = timeSheetJobs;
  // theseJobs = theseJobs.filter(function(e){ return e.company == 'FUD01' });
  // theseJobs = theseJobs.splice(175,175);
  console.log(theseJobs.length);
  theseJobs.forEach(function(e,i){
    var waitFor = 10;
    setTimeout(function () {
      var jobId = e.code; console.log('jobId: ',jobId);
      $.getJSON(localApp+'storeAdHocJobRecords/powerbi/POWERBI_ORE_COMMESSE/'+jobId, function( result ) {
        var thisMessage = "storico dati aggiornati per la commessa: "+jobId+", elementi trovati: "+result.storedRecords;
        console.log('elementi trovati: '+result.storedRecords);
        getSuccessAlert(element,thisMessage,'prepend');
      });
      console.log('i: ',i);
      console.log(waitFor+' seconds for the next update:');
    }, 1000*waitFor*i);
  });
};
function getlaggerUsers(){
  var element = $('#badge-utenti-ritardatari');
  $.getJSON('/laggerUsers', function( result ) {
    var thisMessage = "utenti ritardatari: "+result.count;
    getSuccessAlert(element,thisMessage,'prepend');
  });
};
function updateEmails(id){
  var email = $('input[name=email-'+id+']')[0].value; console.log('email: ',email);
  var element = $('#modal-users-header-table');
  var thisUser = TimeSheetUsers.inSospeso.filter(function(e){ return e.userId == id });
  $('input[name=email-'+id+']').parent().parent().parent().parent().parent().hide();

  $.getJSON( '/updateUncompleteUsers/'+id+'/'+email, function( result ) {
    var thisMessage = 'email aggiunta con successo, utente abilitato: '+thisUser[0].name+' '+thisUser[0].surname;
    getSuccessAlert(element,thisMessage,'prepend');
    updateBadges();
    setTimeout(function(){
      setUserTable('#modal-users-table','#table-users',userHeaders,'inSospeso');
    }, 500);
    // console.log("result: ",result);
  });
};
function emailToLagger(id){
  var userId = id.split('invia-email-')[1]; console.log('userId: ',userId);
  var thisEmail = timeSheetUsers.filter(function(e){ return e.userId == userId })[0].email;
  var element = $('#modal-users-header-table');

  $.getJSON('/sendmail/'+thisEmail, function(result) { });
  $('#'+id).toggle();

  var thisMessage = "email di notifica inviata all'indirizzo: "+thisEmail;
  getSuccessAlert(element,thisMessage,'prepend');
}
function configDocumentUsersAttivi(id,config){
  var userId = id.split('abilita-utente-')[1];
  $('#'+id).parent().parent().toggleClass('disabled-data');
  $('#'+id).toggleClass('disabled');
  if(config==true){
    var obj = {config:'disabled userIds attivi', userId:userId}; //console.log(obj);
    $.post('/configDisabledUsers',obj,function(response){ updateBadges() },'json');
    var obj = {config:'disabled userIds lagger', userId:userId};
    $.post('/configDisabledUsers',obj,function(response){console.log(response)},'json');
  };
};
function configDocumentUsersInSospeso(id,config){
  var userId = id.split('abilita-utente-')[1];
  $('#'+id).parent().parent().toggleClass('disabled-data');
  $('#'+id).toggleClass('disabled');
  if(config==true){
    var obj = {config:'disabled userIds inSospeso', userId:userId}; //console.log(obj);
    $.post('/configDisabledUsers',obj,function(response){ updateBadges() },'json');
  };
};
function emailToLaggerConfig(id,config){
  var userId = id.split('abilita-notifica-')[1];
  $('#'+id).parent().parent().toggleClass('disabled-data');
  $('#'+id).toggleClass('disabled');
  $('#invia-email-'+userId).toggleClass('disabled');

  switch ($('#invia-email-'+userId).attr('onClick')) {
    case '': $('#invia-email-'+userId).attr('onClick','emailToLagger("invia-email-'+userId+'")'); break;
    default: $('#invia-email-'+userId).attr('onClick','');
  };

  if(config==true){
    var obj = {config:'disabled userIds lagger', userId:userId};
    $.post('/configDisabledUsers',obj,function(response){console.log(response)},'json');
  };
};
function setEmailNotificationConfig(){
  var lag = $('#config-email-lag').val();
  var disabled = $('#config-email-disabled')[0].checked;
  var obj = {lag:lag, disabled:disabled};
  $.post('/configDocumentEmail',obj,function(response){ updateBadges() },'json');
};
function getEmailNotificationConfig(){
  $.getJSON('/configDocumentEmail', function( result ) {
    $('#config-email-lag').val(result.lag);
    $('#config-email-disabled')[0].checked = result.disabled;
  });
};
function updateJobs(element){
  $('#progress-'+element.id).toggleClass('d-none');
  $.getJSON( localApp+'updateJobs', function( result ) {
    var thisMessage = 'aggiornate con successo '+result.response.length+' commesse';
    getSuccessAlert(element,thisMessage,'append');
    updateBadges();
    $('#progress-'+element.id).toggleClass('d-none');
    console.log("result: ",result);
  });
};
function updateUsers(element){
  $('#progress-'+element.id).toggleClass('d-none');
  $.getJSON( localApp+'updateUsers', function( result ) {
    if(result.newUsers[0]){
      var thisMessage = 'nuovi utenti: '+result.newUsers.length;
      getSuccessAlert(element,thisMessage,'append');
    }
    if(result.updatedUsers[0]){
      var thisMessage = 'utenti aggiornati: '+result.updatedUsers.length;
      getSuccessAlert(element,thisMessage,'append');
    }
    if(result.emailNotFound[0]){
      var thisMessage = 'utenti senza email: '+result.emailNotFound.length+', aggiungere le email per abilitarli';
      getWarningAlert(element,thisMessage,'append');
    }
    $('#progress-'+element.id).toggleClass('d-none');
    updateBadges();
    console.log("updateUsers result: ",result);
  });
};
function storeRecords(element){
  $('#progress-'+element.id).toggleClass('d-none');
  $.getJSON( localApp+'storeRecords', function( result ) {
    console.log("result: ",result);
    if(result.name=="RequestError"){
      var thisMessage = result.originalError.info.message;
      if( thisMessage == "Violation of PRIMARY KEY constraint 'pk_TIMESHEET'. Cannot insert duplicate key in object 'dbo.TIMESHEET'."){
        thisMessage = 'uno dei documenti che si sta cercando di inviare è già presente in adHoc'
      }
      $('#progress-'+element.id).toggleClass('d-none');
      return getDangerAlert(element,thisMessage,'append');
    };
    if(result.message=="non ci sono nuovi dati da salvare"){
      var thisMessage = result.message;
      $('#progress-'+element.id).toggleClass('d-none');
      return getSuccessAlert(element,thisMessage,'append');
    };
    var thisMessage = 'inviati con successo '+result.rowsAffected.length+' documenti';
    $('#progress-'+element.id).toggleClass('d-none');
    getSuccessAlert(element,thisMessage,'append');
    updateBadges();
  });
};
function getSuccessAlert(element,message,position){
  var html = [
    '<div class="alert alert-info alert-dismissible fade show" role="alert">',
      '<strong>Operazione completata</strong> '+message,
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
        '<span aria-hidden="true">&times;</span>',
      '</button>',
    '</div>'
  ];
  if(position == 'append'){ $(element).parent().append(html.join("\n")) }
  else { $(element).parent().prepend(html.join("\n")) };
};
function getWarningAlert(element,message,position){
  var html = [
    '<div class="alert alert-warning alert-dismissible fade show" role="alert">',
      '<strong>Utenti in sospeso</strong> '+message,
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
        '<span aria-hidden="true">&times;</span>',
      '</button>',
    '</div>'
  ];
  if(position == 'append'){ $(element).parent().append(html.join("\n")) }
  else { $(element).parent().prepend(html.join("\n")) };
};
function getDangerAlert(element,message,position){
  var html = [
    '<div class="alert alert-danger alert-dismissible fade show" role="alert">',
      '<strong>Errore</strong> '+message,
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
        '<span aria-hidden="true">&times;</span>',
      '</button>',
    '</div>'
  ];
  if(position == 'append'){ $(element).parent().append(html.join("\n")) }
  else { $(element).parent().prepend(html.join("\n")) };
};
function setBadge(element,value){
  $(element).html(value)
};
