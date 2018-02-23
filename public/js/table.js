var userHeaders = {
  inSospeso:['abilita','email','nome','userId','azienda','area'],
  attivi:['abilita','email','nome','userId','update','azienda','area'],
  ritardatari:['abilita','email','invia','nome','azienda','area']
};
var jobHeaders = ['codice','descrizione','note','PL','azienda'];
// var userTable = { columns : [], data : [] };

$(document).ready(function(){
  console.log('start table');
  // $.fn.bootstrapTable.columnDefaults.sortable=true;
  $.fn.bootstrapTable.defaults.sortable=true;
  $.fn.bootstrapTable.defaults.sortName='nome';
  $.fn.bootstrapTable.defaults.sortOrder='asc';
});
function setTableHeaders(table,list){
  list.forEach(function(e){
    table.columns.push({ field: e, title: e });
  });
};
function setTableRowsUsers(table,data){
  switch (data) {
    case TimeSheetUsers.attivi:
      data.forEach(function(e){
        var thisNotification = [
          '<button id="abilita-utente-'+e.userId+'" type="button" class="btn btn-default" title="abilita/disabilita notifica email" onclick="configDocumentUsersAttivi(this.id,true)">',
            '<img src="/img/icons/octicons/issue-closed.svg" class="glyphIcon" alt=""/>',
          '</button>'
        ].join("\n");
        var thisUserId = [
          '<button id="aggiorna-dati-'+e.userId+'" type="button" class="btn btn-default" title="aggiorna dati storici da adHoc">',
            '<img src="/img/icons/octicons/cloud-download.svg" class="glyphIcon" alt=""/>',
          '</button>'
        ].join("\n");
        var thisRow = {
          nome: e.name+' '+e.surname,
          userId: e.userId,
          abilita:thisNotification,
          update: thisUserId,
          area:setUserArea(e.area),
          azienda:setUserCompany(e.company),
          email:e.email
        };
        table.data.push(thisRow); // console.log("thisRow: ",thisRow);
      }); // console.log('dati per utenti attivi');
      break;
    case TimeSheetUsers.ritardatari:
      data.forEach(function(e){
        var thisNotification = [
          '<button id="abilita-notifica-'+e.userId+'" type="button" class="btn btn-default" title="abilita/disabilita notifica email" onclick="emailToLaggerConfig(this.id,true)">',
            '<img src="/img/icons/octicons/issue-closed.svg" class="glyphIcon" alt=""/>',
          '</button>'
        ].join("\n");
        var thisEmail = [
          '<button id="invia-email-'+e.userId+'" type="button" class="btn btn-default" title="invia email di notifica" onclick="emailToLagger(this.id)">',
            '<img src="/img/icons/glyph/si-glyph-paper-plane.svg" class="glyphIcon" alt=""/>',
          '</button>'
        ].join("\n");
        var thisRow = {
          nome: e.name+' '+e.surname,
          abilita: thisNotification,
          useId: e.userId,
          area:setUserArea(e.area),
          azienda:setUserCompany(e.company),
          email:e.email,
          invia:thisEmail
        };
        table.data.push(thisRow); // console.log("thisRow: ",thisRow);
      });
      break;
    case TimeSheetUsers.inSospeso:
      data.forEach(function(e){
        var thisNotification = [
          '<button id="abilita-utente-'+e.userId+'" type="button" class="btn btn-default" title="abilita/disabilita notifica email" onclick="configDocumentUsersInSospeso(this.id,true)">',
            '<img src="/img/icons/octicons/issue-closed.svg" class="glyphIcon" alt=""/>',
          '</button>'
        ].join("\n");

        var emailValue = (e.name[0]+"."+e.surname).split(" ").join("").toLowerCase()+"@l22.it";
        switch (setUserArea(e.area)) {
          case ('DEGW'): emailValue = (e.name[0]+e.surname).split(" ").join("").toLowerCase()+"@degw.it"; break;
          case ('Eclettico'): emailValue = (e.name[0]+"."+e.surname).split(" ").join("").toLowerCase()+"@ecld.it"; break;
          case ('Grafica'): emailValue = (e.name[0]+"."+e.surname).split(" ").join("").toLowerCase()+"@fudfactory.it"; break;
        };

        var emailHtml = [
          '<form class="form-email-'+e.userId+'">',
            '<div class="input-group">',
              '<div class="input-group-prepend">',
                '<input type="email" class="form-control" name="email-'+e.userId+'" required="" value="'+emailValue+'" placeholder="email">',
                '<button type="button" class="btn btn-default" title="'+e.userId+'" onclick="updateEmails(this.title)"><img src="/img/icons/glyph/si-glyph-paper-plane.svg" class="glyphIcon" alt=""/></button>',
              '</div>',
            '</div>',
          '</form>'
        ].join("\n");

        var thisRow = {
          nome: e.name+' '+e.surname,
          userId: e.userId,
          abilita: thisNotification,
          area:setUserArea(e.area),
          azienda:setUserCompany(e.company),
          email:emailHtml
        };
        table.data.push(thisRow); // console.log("thisRow: ",thisRow);
      })
      break;
    default:
      data.forEach(function(e){
        var thisRow = {
          nome: e.name+' '+e.surname,
          userId: e.userId,
          area:setUserArea(e.area),
          azienda:setUserCompany(e.company),
          email:e.email
        };
        table.data.push(thisRow); // console.log("thisRow: ",thisRow);
      });
  };
};
function setTableRowsJobs(table,data){
  data.forEach(function(e){
    var thisRow = {
      codice: '<div class="cellaTabella">'+e.codeNumber+'</div>',
      descrizione: '<div class="cellaTabella">'+e.description+'</div>',
      note:'<div class="cellaTabella">'+e.note+'</div>',
      PL:'<div class="cellaTabella">'+"da definire"+'</div>',
      azienda:'<div class="cellaTabella">'+setJobCompany(e.company)+'</div>'
    };
    table.data.push(thisRow); // console.log("thisRow: ",thisRow);
  })
};
function setHtmlTable(modalId,tableId){
  $(modalId).html(null);
  var html = [
    '<div class="fixed-table-toolbar input-group mb-1">',
      '<div class="input-group-prepend">',
        '<button type="button" id="button-refresh" class="btn btn-default" title="Refresh columns visibility"><img src="/img/icons/glyph/si-glyph-arrow-reload.svg" class="glyphIcon" alt=""/></button>',
        '<button type="button" id="menu-columns" class="btn btn-default dropdown-toggle dropdown-toggle-split" aria-label="columns" data-toggle="dropdown">',
          '<img src="/img/icons/glyph/si-glyph-bullet-checked-list.svg" class="glyphIcon" alt=""/>',
          '<span class="caret"></span>',
        '</button>',
        '<ul id="dropdown-menu-columns" class="dropdown-menu" role="menu"></ul>',
      '</div>',
      '<input type="text" id="filter-general" class="form-control" placeholder="Search">',
    '</div>',
    '<table id="table-users"></table>'
  ].join('\n');
  $(modalId).append(html);

  // $('#button-refresh').attr('onClick', 'refreshColumns(userHeaders)');
  // setDropdownMenu(tableId,'#dropdown-menu-columns',userHeaders);
  setFilterGeneral(tableId,'#filter-general');
};
function setHtmlJobTable(modalId,tableId){
  $(modalId).html(null);
  var html = [
    '<div class="fixed-table-toolbar input-group mb-1">',
      '<div class="input-group-prepend">',
        '<button type="button" id="button-refresh" class="btn btn-default" title="Refresh columns visibility"><img src="/img/icons/glyph/si-glyph-arrow-reload.svg" class="glyphIcon" alt=""/></button>',
        '<button type="button" id="menu-columns" class="btn btn-default dropdown-toggle dropdown-toggle-split" aria-label="columns" data-toggle="dropdown">',
          '<img src="/img/icons/glyph/si-glyph-bullet-checked-list.svg" class="glyphIcon" alt=""/>',
          '<span class="caret"></span>',
        '</button>',
        '<ul id="dropdown-menu-columns" class="dropdown-menu" role="menu"></ul>',
      '</div>',
      '<input type="text" id="filter-general" class="form-control" placeholder="Search">',
    '</div>',
    '<table id="table-jobs"></table>'
  ].join('\n');
  $(modalId).append(html);

  $('#button-refresh').attr('onClick', 'refreshColumns(jobHeaders)');
  setDropdownMenu(tableId,'#dropdown-menu-columns',jobHeaders);
  setFilterGeneral(tableId,'#filter-general');
};
function setUserTable(modalId,tableId,headers,data){
  var thisTable = { columns : [], data : [] };
  setHtmlTable(modalId,tableId);
  setTableHeaders(thisTable,userHeaders[data]);
  setTableRowsUsers(thisTable,TimeSheetUsers[data]);

  $('#button-refresh').attr('onClick', 'refreshColumns(userHeaders[data])');
  setDropdownMenu(tableId,'#dropdown-menu-columns',userHeaders[data]);

  switch (data) {
    case 'inSospeso':
      $('#modal-users-LongTitle').html('Utenti in sospeso');
      $(tableId).bootstrapTable(thisTable);
      TimeSheetUsers.inSospesoDisabled.forEach(function(userId){
        configDocumentUsersInSospeso('abilita-utente-'+userId);
      });
      break;
    case 'attivi':
      $('#modal-users-LongTitle').html('Utenti attivi');
      $(tableId).bootstrapTable(thisTable);
      $('button[title="aggiorna dati storici da adHoc"]').attr('onclick','setRecordButtonsFromTable(this)');
      TimeSheetUsers.attiviDisabled.forEach(function(userId){
        configDocumentUsersAttivi('abilita-utente-'+userId);
      });
      break;
    case 'ritardatari':
      $('#modal-users-LongTitle').html('Utenti ritardatari');
      $(tableId).bootstrapTable(thisTable);
      TimeSheetUsers.ritardatariDisabled.forEach(function(userId){
        emailToLaggerConfig('abilita-notifica-'+userId);
      });
      break;
  };
};
function setJobTable(modalId,tableId,headers,data){
  var table = { columns : [], data : [] };
  setHtmlJobTable(modalId,tableId);
  switch (data) {
    case 'jobs':
      setTableHeaders(table,headers);
      setTableRowsJobs(table,timeSheetJobs);
      $('#modal-job-LongTitle').html('Elenco commesse');
      break;
    case 'activities':
      setTableHeaders(table,headers);
      setTableRowsJobs(table,timeSheetJobs);
      $('#modal-job-LongTitle').html('Elenco attività');
    break;
  };
  $(tableId).bootstrapTable(table);
  // spegnere colonne di default
  $('#dropdown-menu-columns > li > label > input[name="note"]').click();
  $('#dropdown-menu-columns > li > label > input[name="PL"]').click();
  $('#table-jobs > tbody > tr').attr('onclick','selectJobFromTable(this)');
};
function selectJobFromTable(element){
  var selectedJob = element.children[0].innerText.trim();
  $("input#data-insert-job").val(selectedJob);
  setActivities(selectedJob);
  $('#modal-job').modal('toggle');
};
function setRecordButtonsFromTable(element){
  console.log(element);
  var selectedId = element.id.split('aggiorna-dati-')[1]; console.log('selectedId:',selectedId);
  aggiornaStoricoDatiAdHoc(selectedId);
}
function setFilterGeneral(table,id){
  $(id).keyup(function () {
    var text = $(this).val(); // console.log(text);
    var LowerText = text.toLowerCase(); // console.log(LowerText);
    var UpperText = text.toUpperCase(); // console.log(UpperText);
    var CapitalizedText = LowerText.substr(0,1).toUpperCase()+LowerText.substr(1); // console.log(CapitalizedText);

    if( text == ""){ $(table+' > tbody > tr').show() }
    else {
      $(table+' > tbody > tr').hide();

      $(table+" > tbody > tr:contains('"+text+"')").show();
      $(table+" > tbody > tr:contains('"+LowerText+"')").show();
      $(table+" > tbody > tr:contains('"+UpperText+"')").show();
      $(table+" > tbody > tr:contains('"+CapitalizedText+"')").show();
    };
  });
};
function setDropdownMenu(tableId,dropdownId,list){
  list.forEach(function(e,index){
    var li = [
      '<li role="menuitem" class="ml-2">',
      '<label><input type="checkbox"name="'+e+'" value="'+index+'" checked="checked"> '+e+'</label>',
      '</li>'
    ].join("\n");
    $(dropdownId).append(li);
    $('#dropdown-menu-columns > li > label > input[name="'+e+'"]').attr('onchange', 'setCheckedVisibility("'+tableId+'",this)');
  });
};
function setCheckedVisibility(table,checkbox){
  checkbox.checked ? $(table).bootstrapTable('showColumn', checkbox.name):$(table).bootstrapTable('hideColumn', checkbox.name);
  $("#menu-columns").click();
};
function refreshColumns(list){
  list.forEach(function(e,index){
    $('#dropdown-menu-columns > li > label > input[name="'+e+'"]')[0].checked ? console.log("ok"): $('#dropdown-menu-columns > li > label > input[name="'+e+'"]').click();
  });
};
//$('.searchable tr').hide();
//$('.searchable tr').show();

//$('#table').bootstrapTable('hideRow', {index:1});
//$('#table').bootstrapTable('showRow', {index:1});

//$('#table').bootstrapTable('showColumn', 'name');
//$('#table').bootstrapTable('hideColumn', 'name');

//$('#table').bootstrapTable('refresh');
//$('#table').bootstrapTable('filterBy', { stars: ["star 1","star 2"] }); ///// non funziona
