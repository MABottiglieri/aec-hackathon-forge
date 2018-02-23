var timeSheetData = {
  userId:userId,
  userCompany:userCompany.split(","),
  userArea:userArea,
  userRole:userRole.split(","),
  days:[],
  rows:[]
};
var timeSheetJobs = [];
var timeSheetPL = { userId:userId,jobs:[],people:[]};
var timeSheetUsers = [];
var activeDay = [];
var activeRowId;
var activeView = "#TimeSheet";
var edit = false;
var dataInsert = false;
var myCharts = {
  doughnut:{
    options:{
      legend: { display: true, position:"bottom", labels:{boxWidth: 10} },
      layout: { padding: { left: 5, right: 5, top: 5, bottom: 5 } },
      responsive:true,
      animation:{animateRotate: true, animateScale: false},
      cutoutPercentage:50,
      maintainAspectRatio:false,
      scales: {
        //xAxes: [{ ticks: {min: 20, max: 75, beginAtZero: true}}],
        //yAxes: [{ ticks: {min: 0, max: 5, beginAtZero: true}}]
      },
      title: { display: true, text: 'ore per commessa' }
    },
    charts:[]
  },
  bar:{
    options:{
      legend: { display: false, position:"bottom", labels:{boxWidth: 10} },
      layout: { padding: { left: 5, right: 5, top: 5, bottom: 5 } },
      responsive:true,
      maintainAspectRatio:false,
      scales: {
        xAxes: [{ ticks: {min: 0, beginAtZero: true}}],
        yAxes: [{ ticks: {min: 0, beginAtZero: true}}]
      },
      title: { display: true, text: 'report' }
    },
    charts:[]
  }
};

$( document ).ready(function(){
  console.log('start Home');
  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  if (isIE){
    $('body').html(null);
    var thisHtml=[
      '<div class="container">',
        '<div class="row">',
          '<h2 class="col-12">il browser Internet Explorer non è supportato</h2>',
          '<p class="col-12">accedere al TimeSheet utilizzando Chrome o Safari</p>',
        '</div>',
      '</div>'
    ].join('\n');
    $('body').append(thisHtml);
  }
  else {
    $('#area').html(setUserArea(timeSheetData.userArea));
    checkUserRole();
    setFilterChartOptions();
    getStoredAdHocRecords(); // getStoredRecords();
    setDays(new Date());

    $(".calendar-day").attr('onClick', 'setClassActiveDay("#"+$(this).attr("id"))');
    $(".calendar-day").attr('ondblclick', '$("#button-data-add").click()');

    $("#button-data-add").attr('onClick', 'activateDataInsert(true); refreshJob()');
    $("#data-insert-button-close").attr('onClick', 'activateDataInsert(false); edit=false');
    $("#data-insert-button-save").attr('onClick', 'saveData(); setDataRead(activeDay[0])');

    $('#data-insert-job').attr('onChange', 'setActivities(this.value)');
    // $('#data-insert-activity').attr('disabled',true);

    $('#job-reset').attr('onClick', 'refreshJob()');
    $('#content-main-right').scrollTop($('#content-main-right')[0].scrollHeight);

    getJobs();
    getUsers();
    $('.user-commesse').attr('onChange','refreshChartByFilter()');
    $('.pl-dettagli').attr('onChange','refreshChartByFilter_pl_dettagli()');
    $('.pl-commesse').attr('onChange','refreshChartByFilter_pl_commesse()');
    $('#config-email-lag').attr('onChange','setEmailNotificationConfig()');
    $('#config-email-disabled').attr('onChange','setEmailNotificationConfig()');
  }
});
function checkUserRole(){
  var thisPL = timeSheetData.userRole.filter(function(e){ return e=="timesheetPL" });
  var thisCL = timeSheetData.userRole.filter(function(e){ return e=="timesheetCL" });
  var thisAdmin = timeSheetData.userRole.filter(function(e){ return e =='timesheetAdmin'});
  if (thisAdmin[0]){
    if(!thisPL[0]){ thisPlHtml() };
    thisAdminHtml();
    getPL();
  };
  if(thisPL[0]) { thisPlHtml() };
  function thisAdminHtml(){
    var thisHtml = [
      '<div class="dropdown-divider"></div>',
      '<div id="Admin" class="dropdown-item pointer" onclick="">Amministrazione</div>'
    ].join('\n');
    $("#navbarDropdown-menu").append(thisHtml);
    $("#Admin").attr('onClick', 'changeView("#Amministrazione")');

    thisHtml = '<select id="filter-pl" class="form-control my-1" title="PL"></select>';
    $("#PL").prepend(thisHtml);
    $('#filter-pl').attr('onChange','getJobsPL(this.value); refreshChartByFilter_pl_commesse()');
  };
  function thisPlHtml(){
    var thisHtml = '<div id="AreaPL" class="dropdown-item pointer">Area PL/CL</div>';
    $("#navbarDropdown-menu").append(thisHtml);
    $("#AreaPL").attr('onClick', 'changeView("#PL"); refreshChartByFilter_pl_commesse();');
  };
};
function refreshChartByFilter(){
  var year = $('#filter-chart-year').val();
  var month = $('#filter-chart-month').val();
  var thisData = userData(year,month,01);
  var theseOptions = myCharts.doughnut.options;
  SetDoughnutChart("content-data-chart",thisData,theseOptions);
};
function changeView(thisView){
  $(activeView).toggleClass('d-none');
  $(thisView).toggleClass('d-none');
  getStoredAdHocRecords();
  updateBadges();
  activeView = thisView;
};
function getStoredAdHocRecords(){
  $.getJSON( "/getAdHocRecords/"+timeSheetData.userId, function( data ) {
    timeSheetData.rows = data.docs;
    getStoredRecords();
  });
};
function getStoredRecords(){
  $.getJSON( "/getRecords/"+timeSheetData.userId, function( data ) {
    data.docs.forEach(function(e){
      timeSheetData.rows.push(e);
    });
    refreshChartByFilter();
    updateHours();
    setDataRead(activeDay[0]);
  });
};
function setFilterChartOptions(){
  var lastYears = 10;
  var thisYear = Number(new Date().getFullYear());
  for(var i=0;i<lastYears;i++){
    $('#filter-chart-year').append('<option value="'+thisYear+'">'+thisYear+'</option>');
    $('#filter-chart-year-pl-dettagli').append('<option value="'+thisYear+'">'+thisYear+'</option>');
    $('#filter-chart-year-pl-commesse').append('<option value="'+thisYear+'">'+thisYear+'</option>');
    thisYear--;
  };
  var htmlMonths = [
    '<option value="0">January</option>',
    '<option value="1">February</option>',
    '<option value="2">March</option>',
    '<option value="3">April</option>',
    '<option value="4">May</option>',
    '<option value="5">June</option>',
    '<option value="6">July</option>',
    '<option value="7">August</option>',
    '<option value="8">September</option>',
    '<option value="9">October</option>',
    '<option value="10">November</option>',
    '<option value="11">December</option>'
  ].join('\n');
  $('#filter-chart-month').append(htmlMonths);
  $('#filter-chart-month-pl-dettagli').append(htmlMonths);
  $('#filter-chart-month-pl-commesse').append(htmlMonths);
  var thisMonth = new Date().getMonth();
  $("#filter-chart-month").val(thisMonth);
};
function setJobCompany(companyCode){
  switch (companyCode) {
    case "LOMBA": return "Lombardini22"; break;
    case "FUD01": return "FUD"; break;
  };
};
function setUserCompany(companyCode){
  var thisCompany = [];
  companyCode.forEach(function(e){
    switch (e) {
      case "LOMBA": e = "Lombardini22"; break;
      case "FUD01": e = "FUD"; break;
    };
    thisCompany.push(e);
  });
  return thisCompany;
};
function setUserArea(areaCode){
  var thisArea = areaCode.trim();
  switch (thisArea) {
    case "AMM": thisArea = "Amministrazione"; break;
    case "ARCH": thisArea = "Architettura"; break;
    case "COMP": thisArea = "Computi"; break;
    case "D ARCH": thisArea = "DEGW"; break;
    case "DDLAB": thisArea = "DDLAB"; break;
    case "ECLD": thisArea = "Eclettico"; break;
    case "GRF": thisArea = "Grafica"; break;
    case "ING": thisArea = "Ingegneria"; break;
    case "MKTG": thisArea = "Marketing"; break;
    case "PM": thisArea = "Project Management"; break;
    case "PRAT": thisArea = "Pratiche"; break;
    case "SIC": thisArea = "Sicurezza"; break;
  };
  return thisArea;
};
function getJobs(){
  timeSheetData.userCompany.forEach(function(e){
    timeSheetJobs = [];
    $.getJSON( "/getJobs/"+e, function( data ) {
      data.docs.sort(function(a, b){return b.code - a.code});
      data.docs.forEach(function(e){
        if(Number(e.code)){ e.codeNumber = Number(e.code) }
        else { e.codeNumber = e.code; };
        timeSheetJobs.push(e);
        getJobsPL(timeSheetPL.userId);
      }); //console.log("timeSheetJobs: ",timeSheetJobs);
      setDatalistJobs('datalist-jobs',timeSheetJobs);
    });
  });
};
function splitId(dayId){
  var monthId;

  switch (dayId.split("#")[1].split("-")[1]) {
    case "Jan": monthId = 0; break;
    case "Feb": monthId = 1; break;
    case "Mar": monthId = 2; break;
    case "Apr": monthId = 3; break;
    case "May": monthId = 4; break;
    case "Jun": monthId = 5; break;
    case "Jul": monthId = 6; break;
    case "Aug": monthId = 7; break;
    case "Sep": monthId = 8; break;
    case "Oct": monthId = 9; break;
    case "Nov": monthId = 10; break;
    case "Dec": monthId = 11; break;
  };

  return {
    year: dayId.split("#")[1].split("-")[0],
    month: dayId.split("#")[1].split("-")[1],
    day: dayId.split("#")[1].split("-")[2],
    monthId:monthId
  };

};
function newDay(day){
  var thisYear = day.getFullYear();
  var thisMonth = day.toDateString().split(" ")[1];
  var thisDay = day.getDate().toString();
  // if (!thisDay[1]) { thisDay="0"+thisDay; };

  var thisId = thisYear+"-"+thisMonth+"-"+thisDay;
  var thisHtml = [
    '<div id="'+thisId+'" class="col no-gutters calendar-day">',
      '<div class="col text-center calendar-text-month">'+thisMonth+'</div>',
      '<div class="col text-center calendar-text-day">'+thisDay+'</div>',
      '<div class="col text-center calendar-text-hours"></div>',
    '</div>'
  ];

  if(day.getMonth() == new Date().getMonth()){
    thisHtml[0]='<div id="'+thisId+'" class="col no-gutters  calendar-day calendar-this-month">';
  };

  thisHtml = thisHtml.join("\n");

  var thisObject = {
    day:{
      dayId:"#"+thisId,
      userId:timeSheetData.userId,
      year:thisYear,
      month:thisMonth,
      day:thisDay,
      hours:0,
      editable:true,
      dataRows:[]
    },
    html:thisHtml
  };
  return thisObject;
};
function setDays(today){
  //dal primo giorno del mese precedente
  //all'ultimo giorno del mese in corso (uguale al mese in corso +1 e giorno all'indice 0 )
  var NumeroDiMesiPrecedeti = 1;
  var firstDay = new Date(today.getFullYear(),(today.getMonth()-NumeroDiMesiPrecedeti),1); //console.log("firstDay:",firstDay)
  switch (firstDay.getDay()) {
    case 0: firstDay.setDate(firstDay.getDate() - 6); break;
    default: firstDay.setDate(firstDay.getDate() - (firstDay.getDay()-1));
  };

  var lastDay = new Date(today.getFullYear(),today.getMonth()+1,0); //console.log("lastDay:",lastDay)
  switch (lastDay.getDay()) {
    case 0: break;
    default:lastDay.setDate(lastDay.getDate() + (7+7-lastDay.getDay()));  //aggiungiamo una settimana in più, poi eliminiamo dal calendario le settimane con meno di 7 giorni
  };
  //console.log("firstDay week: ",firstDay);
  //console.log("lastDay week: ",lastDay);
  var timeDiff = lastDay-firstDay; //console.log("timeDiff: \n",timeDiff);
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //console.log("diffDays: \n",diffDays);

  var dayHtml = newDay(firstDay).html; //console.log("dayHtml: \n",dayHtml);
  var week = 1;
  var weekHtml = '<div id="week-'+week+'" class="row calendar-week no-gutters"></div>';
  $('#content-calendar').append(weekHtml);
  $('#week-'+week).append(dayHtml);

  var day = newDay(firstDay).day;
  timeSheetData.days.push(day);

  for(var i=0;i<diffDays;i++){
    firstDay.setDate(firstDay.getDate() + 1); //console.log(i+" - firstDay:",firstDay);
    var dayHtml = newDay(firstDay).html; //console.log("dayHtml: \n",dayHtml);
    day = newDay(firstDay).day;

    if(firstDay > new Date()){ day.editable=false };
    timeSheetData.days.push(day);

    if(firstDay.getDay()==1){
      week++;
      weekHtml = '<div id="week-'+week+'" class="row calendar-week no-gutters"></div>';
      $('#content-calendar').append(weekHtml);
      $('#week-'+week).append(dayHtml);
    } else {
      $('#week-'+week).append(dayHtml);
    };
  };

  $('#week-'+week).remove(); //rimozione dell'ultima settimana (a volte si formatta male)
  $('.calendar-week > div:nth-child(6)').toggleClass('ml-2');

  var thisDayId = newDay(today).day.dayId;
  setClassActiveDay(thisDayId);
  $('#content-calendar').scrollTop($('#content-calendar')[0].scrollHeight);
};
function setDatalistJobs(id,jobsData){
  $('#'+id).html(null);
  jobsData.forEach(function(e){
    if(e.code=="AMMINISTRAZIONE"){
      if(e.company=="LOMBA"){ $('#'+id).append("<option value='"+e.codeNumber+"' data-company='"+e.company+"'>Amministrazione Lombardini22</option>") }
      else { $('#'+id).append("<option value='"+e.codeNumber+"' data-company='"+e.company+"'>Amministrazione FUD</option>") };
    }
    else { $('#'+id).append("<option value='"+e.codeNumber+"' data-company='"+e.company+"'>"+e.description+" - "+e.note.match(/.{1,70}/g)[0] +"</option>") };
  });
};
function refreshJob(){
  $("input#data-insert-job").val(null);
  $("#data-insert-activity").val(null);
  $("#data-insert-activity").html(null);
  // $('#data-insert-activity').attr('disabled',true);
}
function setActivities(jobData){
  $("#data-insert-activity").val(null);
  $("#data-insert-activity").html(null);
  // $('#data-insert-activity').attr('disabled',false); //

  if(jobData == 'AMMINISTRAZIONE'){
    $('#data-insert-activity').prepend("<option value='default' selected></option>");
    var thisJob = timeSheetJobs.filter(function(e){ return (e.codeNumber == jobData) });
    thisJob.forEach(function(e){
      $('#data-insert-activity').append("<option value='"+e.activities[0].code+"'>"+e.activities[0].code+" - "+e.activities[0].description+" "+setJobCompany(e.company)+"</option>");
    })
  }
  else {
    var thisJob = timeSheetJobs.filter(function(e){ return (e.codeNumber == jobData) });
    thisJob[0].activities.forEach(function(e){
      $('#data-insert-activity').append("<option value='"+e.code+"'>"+e.code+" - "+e.description+"</option>");
    });
    if(thisJob[0].activities.length == 1){ $("#data-insert-activity").val(thisJob[0].activities[0].code) }
    else { $('#data-insert-activity').prepend("<option value='default' selected></option>") }
  };
  console.log('jobData: ',jobData);
};
function setDataInsertCalendar(){
  $("#data-insert-calendar").html(null);
  var daySelected = $(".calendar-day-selected");
  if(!daySelected[0]){ $("#data-insert-calendar").append("<div id='alert-set-calendar' class='col'>Scegliere almeno un giorno<div>"); }

  for(var i=0;i<daySelected.length;i++){
    var id=daySelected[i].id;
    var thisDay = $("#"+id+" > div.calendar-text-day").html();
    var thisMonth = $("#"+id+" > div.calendar-text-month").html();
    var activeDayId = activeDay[0].dayId.split("#")[1]; console.log("activeDayId", activeDayId);

    if(id==activeDayId){
      var thisDataRow = [
        '<div id="date'+id+'" class="col rounded data-insert-date data-insert-date-active" onClick="setActiveInsertdate(this)">',
          '<div class="col text-center data-insert-month">'+thisMonth+'</div>',
          '<div class="col text-center data-insert-day">'+thisDay+'</div>',
        '</div>'
      ].join("\n");
    }
    else {
      var thisDataRow = [
        '<div id="date'+id+'" class="col rounded data-insert-date"  onClick="setActiveInsertdate(this)">',
          '<div class="col text-center data-insert-month">'+thisMonth+'</div>',
          '<div class="col text-center data-insert-day">'+thisDay+'</div>',
        '</div>'
      ].join("\n");
    };

    $("#data-insert-calendar").append(thisDataRow);
  };
};
function setActiveInsertdate(thisElement){
  var thisId = "#"+thisElement.id;

  var thisMonth = $(thisId+" > div.data-insert-month").html();
  var thisDay = $(thisId+" > div.data-insert-day").html();

  var calendarId = '#'+activeDay[0].year+'-'+thisMonth+'-'+thisDay;
  updateActiveDay(calendarId);
  setDataInsertCalendar();
};
function updateHours(){
  //aggiornamento delle ore nel calendario (dati)
  for(var i=0; i<timeSheetData.days.length; i++){
    var theseRows = timeSheetData.rows.filter(function(e){ return e.dayId == timeSheetData.days[i].dayId });
    var theseHours = 0;

    if(theseRows[0]){
      for(var n=0; n<theseRows.length;n++){
        theseHours+= theseRows[n].hours;
      };
    };
    //aggiornamento delle ore nel calendario
    timeSheetData.days[i].hours = theseHours;
    setHours(timeSheetData.days[i]);
  };
};
function setHours(thisDay){
  var hoursText = 'ore';
  if(thisDay.hours == 1){ hoursText = 'ora' };

  if(thisDay.hours > 9){ $(thisDay.dayId +" > div.calendar-text-hours").addClass("alert-hours") }
  else { $(thisDay.dayId +" > div.calendar-text-hours").removeClass("alert-hours") };

  if(thisDay.hours == 0){
    $(thisDay.dayId +" > div.calendar-text-hours").html(null);
    $(thisDay.dayId).removeClass("calendar-day-checked");
  }
  else {
    $(thisDay.dayId +" > div.calendar-text-hours").html(thisDay.hours+" "+hoursText);
    $(thisDay.dayId).addClass("calendar-day-checked");
  };
};
function setSelectedDay(id){
  var selectedDay = timeSheetData.days.filter(function(e){
    return e.dayId == id;
  });
  if(selectedDay[0].editable == true){
    $(id).toggleClass("calendar-day-selected");
  };
};
function setClassActiveDay(id){
  if(edit==false){
    var selectedDay = timeSheetData.days.filter(function(e){
      return e.dayId == id;
    });
    if(selectedDay[0].editable == true){
      $(".calendar-day-active").toggleClass("calendar-day-active");
      $(id).toggleClass("calendar-day-active");
      updateActiveDay(id);
    };
    $("#content-data-read-bottom").html(null);
    // $("#data-row-notes").html(null);
  };
};
function updateActiveDay(id){
  if(edit==false){
    activeDay = timeSheetData.days.filter(function(e){
      return e.dayId === id ; //console.log("activeDay trovato");
    });
    setDataRead(activeDay[0]);
  }
};
function setDataRead(thisDay){
  $("#content-data-read-top").html(null);
  $("#content-data-read-bottom").html(null);
  // $("#data-row-notes").html(null);

  if(thisDay){
    var theseRows = timeSheetData.rows.filter(function(e){ return e.dayId == thisDay.dayId });
    if(theseRows[0]){
      theseRows.forEach(function(e){
        var thisJob = e.jobId;
        var hoursText = 'Ore';
        if(e.hours == 1){ hoursText = 'Ora'; };
        if(Number(thisJob)){ thisJob=Number(thisJob) };
        var thisHtml = [
          '<div class="row no-gutters rounded data-row" id="'+e._id+'">',
            '<div class="col-auto data-row-hours">',
              '<div class="d-inline data-row-hours-number">'+e.hours+'</div>',
              '<div class="d-inline data-row-hours-text">'+hoursText+'</div>',
            '</div>',
            '<div class="col data-row-job">'+thisJob+'</div>',
          '</div>'
        ].join("\n");
        $("#content-data-read-top").append(thisHtml);

        if(e.editable){
          var EditButtons = [
            '<image class="col-auto button-edit" src="/img/icons/edit.svg"/>',
            '<image class="col-auto button-delete" src="/img/icons/delete.svg"/>'
          ].join("\n");
          $('#'+e._id).append(EditButtons);
        };
      });
    };

    $(".button-edit").attr('onClick', 'editData(this)');
    $(".button-delete").attr('onClick', 'deleteDataRow(this)');
    $(".data-row-job").attr('onClick', 'showNotes(this)');
    if(dataInsert){
      //nascondo i pulsanti edit per i dataRows
      $(".button-edit").toggleClass("d-none");
    }
  };
};
function activateDataInsert(active){
  if(dataInsert){
    dataInsert=false; console.log('chiuso');
    $(".calendar-day").attr('ondblclick', '$("#button-data-add").click()');
    activeRowId = undefined;
   }
  else {
    dataInsert=true; console.log('aperto');
    $(".calendar-day").attr('ondblclick', '');
  };
  //nascondo i pulsanti edit per i dataRows
  $(".button-edit").toggleClass("d-none");

  //inverto la visualizzazione di "#content-data-insert" e "#button-data-add"
  $("#content-data-insert").toggleClass("d-none");
  $("#content-main-right").toggleClass("margin-bottom");
  $("#button-data-add").toggleClass("d-none");

  //modifica l'altezza del calendario
  // $("#content-main-right > div:nth-child(1)").toggleClass("calendar-scroll-1");
  // $("#content-calendar").toggleClass("calendar-scroll-2");

  if(active == true){
    $(".calendar-day-active").toggleClass("calendar-day-selected");
    $(".calendar-day-active").toggleClass("calendar-day-active");
    var thisId = $(".calendar-day-selected").attr("id");
    setDataInsertCalendar();

    if(edit==false){
      $(".calendar-day").attr('onClick', 'updateActiveDay("#"+$(this).attr("id")); setSelectedDay("#"+$(this).attr("id")); setDataInsertCalendar();');
    }
  }
  else {
    $("input#data-insert-job").val(null);
    $("input#data-insert-activity").val(null);
    $("input#data-insert-hours-number").val(null);
    $("textarea#data-insert-note-text").val(null);

    $(".calendar-day-selected").toggleClass("calendar-day-selected");
    $(".calendar-day").attr('onClick', 'setClassActiveDay("#"+$(this).attr("id"))');
    var activeId = "#"+activeDay[0].year+"-"+activeDay[0].month+"-"+activeDay[0].day;
    $(activeId).toggleClass("calendar-day-active");
  };
  // $('#content-calendar').scrollTop($('#content-calendar')[0].scrollHeight);
};
function saveData(){
  var readyToSave = false;
  var job = $("input#data-insert-job").val();
  var activity = $("#data-insert-activity").val();
  var hours = $("input#data-insert-hours-number").val();
  var notes = $("textarea#data-insert-note-text").val(); console.log("notes:\n",notes);
  var thisArea = timeSheetData.userArea;
  var recordToSave = {records:[]};
  var recordToUpdate = {};

  if(Number(hours)>0){
    var thisJob = timeSheetJobs.filter(function(e){ return e.codeNumber == job });
    if(thisJob[0]){
      var thisJobId = thisJob[0].code; // console.log('thisJobId: ',thisJobId);
      var thisActivity = thisJob[0].activities.filter(function(e){ return e.code == activity }); // console.log('activity: ',activity);
      if(thisActivity[0]){
        if(job == "RICERCA SVILUPP" || job == "AMMINISTRAZIONE"){
          if(notes===""){ return alert("Per le commesse 'Amministrazine' e 'Ricerca e Sviluppo' è obbligatorio inserire le note"); }
        }

        var daySelected = $(".calendar-day-selected");
        for(var i=0;i<daySelected.length;i++){
          var id = daySelected[i].id;
          var thisDayId = "#" + id;
          var thisDataRow = {
            //richiesti per tabella adHoc
            company:thisJob[0].company,
            userId: timeSheetData.userId,
            jobId: thisJobId,
            activityId: activity,
            dateRecord: new Date(splitId(thisDayId).year,splitId(thisDayId).monthId,splitId(thisDayId).day,12,0,0,0), // new Date(year, month, day, hours, minutes, seconds, millisenconds)
            hours: Number(hours),
            //richiesti per WebApp TimeSheet
            dayId: thisDayId,
            area: thisArea,
            notes: notes,
            editable: true
          };

          //verifico se il record inserito è nuovo o un documento esistente modificato
          if(activeRowId){
            //documento esistente da modificare
            thisDataRow._id = activeRowId;
            recordToUpdate = thisDataRow; // console.log("recordToUpdate: ",recordToUpdate);

            for(j=0; j<timeSheetData.rows.length; j++){
              if(timeSheetData.rows[j]._id == activeRowId ){
                timeSheetData.rows[j] = thisDataRow; // console.log("record modificato in locale");
              };
            };
          }
          else {
            //documento nuovo da salvare
            recordToSave.records.push(thisDataRow);

            var index = timeSheetData.rows.length+1;
            thisDataRow._id = "row-id-"+index+"-"+ thisDataRow.dayId;
            timeSheetData.rows.push(thisDataRow); // console.log("nuovo record aggiunto in locale");
          };
          // recordToSave.records.push(timeSheetData.days.filter(function(e){return e.dayId == thisDataRow.dayId})[0]); //console.log("fine modifica recordToSave.records:",recordToSave.records);
        };

        activeRowId = undefined;
        readyToSave = true;
      }
      else{
        // verifico se si tratta della commessa AMMINISTRAZIONE
        if(thisJob[1]){
          var thisJobId = thisJob[1].code; // console.log('thisJobId: ',thisJobId);
          var thisActivity = thisJob[1].activities.filter(function(e){ return e.code == activity }); // console.log('activity: ',activity);
          if(thisActivity[0]){
            if(job == "RICERCA SVILUPP" || job == "AMMINISTRAZIONE"){
              if(notes===""){ return alert("Per le commesse 'Amministrazine' e 'Ricerca e Sviluppo' è obbligatorio inserire le note"); }
            }

            var daySelected = $(".calendar-day-selected");
            for(var i=0;i<daySelected.length;i++){
              var id = daySelected[i].id;
              var thisDayId = "#" + id;
              var thisDataRow = {
                //richiesti per tabella adHoc
                company:thisJob[1].company,
                userId: timeSheetData.userId,
                jobId: thisJobId,
                activityId: activity,
                dateRecord: new Date(splitId(thisDayId).year,splitId(thisDayId).monthId,splitId(thisDayId).day,12,0,0,0), // new Date(year, month, day, hours, minutes, seconds, millisenconds)
                hours: Number(hours),
                //richiesti per WebApp TimeSheet
                dayId: thisDayId,
                area: thisArea,
                notes: notes,
                editable: true
              };

              //verifico se il record inserito è nuovo o un documento esistente modificato
              if(activeRowId){
                //documento esistente da modificare
                thisDataRow._id = activeRowId;
                recordToUpdate = thisDataRow; // console.log("recordToUpdate: ",recordToUpdate);

                for(j=0; j<timeSheetData.rows.length; j++){
                  if(timeSheetData.rows[j]._id == activeRowId ){
                    timeSheetData.rows[j] = thisDataRow; // console.log("record modificato in locale");
                  };
                };
              }
              else {
                //documento nuovo da salvare
                recordToSave.records.push(thisDataRow);

                var index = timeSheetData.rows.length+1;
                thisDataRow._id = "row-id-"+index+"-"+ thisDataRow.dayId;
                timeSheetData.rows.push(thisDataRow); // console.log("nuovo record aggiunto in locale");
              };
              // recordToSave.records.push(timeSheetData.days.filter(function(e){return e.dayId == thisDataRow.dayId})[0]); //console.log("fine modifica recordToSave.records:",recordToSave.records);
            };

            activeRowId = undefined;
            readyToSave = true;
          }
        }
        else { return alert("Attività non valida") };
      };
    }
    else { return alert ("commessa non valida") };
  }
  else { return alert("inserire almeno 1 ora") };

  if(readyToSave==true){

    if(edit){
      $.post('/updateRecord', recordToUpdate, function(response) {
        console.log("response: ",response);
      },'json');
    }
    else {
      $.post('/saveNewRecords', recordToSave, function(response) {
        console.log("response: ",response);
      },'json');
    };

    edit = false;
    getStoredAdHocRecords();
    activateDataInsert(false);
  };
};
function editData(element){
  edit = true;
  var id = $(element).parent().attr("id");
  activeRowId = id;
  var thisRow = timeSheetData.rows.filter(function(e){ return e._id == id }); console.log("thisRow:\n", thisRow[0]);
  var thisJob = timeSheetJobs.filter(function(e){ return (e.code == thisRow[0].jobId) }); console.log("thisJob:\n", thisJob[0]);
  $("#data-insert-job").val(thisJob[0].codeNumber);
  setActivities(thisJob[0].codeNumber);

  $("#data-insert-activity").val(thisRow[0].activityId);
  $("#data-insert-hours-number").val(thisRow[0].hours);
  $("#data-insert-note-text").val(thisRow[0].notes);

  if(!dataInsert){ activateDataInsert(true); }
};
function showNotes(element){
  $("#content-data-read-bottom").html(null);
  var id = $(element).parent().attr("id"); //console.log("id: ",id);
  var thisRow = timeSheetData.rows.filter(function(e){ return e._id == id }); //console.log(thisRow);
  var thisJobDescription = thisRow[0].jobId;
  var thisJob = timeSheetJobs.filter(function(e){ return e.code == thisJobDescription }); //console.log(thisRow);
  var thisActivityDescription = thisRow[0].activityId;
  if(thisJob[0]){
    thisJobDescription = thisJob[0].description; // console.log('thisJobId: ',thisJobId);
    var thisActivity = thisJob[0].activities.filter(function(e){ return e.code == thisActivityDescription }); // console.log('activity: ',activity);
    if(thisActivity[0]){ thisActivityDescription = thisActivity[0].description };
  };
  var thisHtml = [
    '<div class="col rounded mb-2 py-2 light">',
      '<div id="job-description" class="row mx-1">',
        '<strong>Commessa:&nbsp;</strong>',
        '<div>'+thisJobDescription+'</div>',
      '</div>',
      '<div id="activity-description" class="row mx-1">',
        '<strong>Attività:&nbsp;</strong>',
        '<div>'+thisRow[0].activityId+' - '+thisActivityDescription+'</div>',
      '</div>',
      '<div id="notes" class="row mx-1">',
        '<strong>Note:&nbsp;</strong>',
        '<div>'+thisRow[0].notes+'</div>',
      '</div>',
    '</div>'
  ].join('\n');
  $("#content-data-read-bottom").append(thisHtml);
};
function deleteDataRow(element){
  var id = $(element).parent().attr("id"); console.log("id: ",id);
  var dayToRemove = timeSheetData.rows.filter(function(e){ return e._id == id }); console.log("dayToRemove: ",dayToRemove[0]);
  //eliminazine del documento dal database
  $.post('/removeRecord', dayToRemove[0], function(response) {
    console.log("response: ",response);
  },'json');
  //eliminazine del documento dal JavaScript locale
  timeSheetData.rows.forEach(function(e,i){
    if(e._id==id){
      timeSheetData.rows.splice(i,1);
    };
  }); //console.log("timeSheetData.rows",timeSheetData.rows);
  $(element).parent().remove(); //console.log($(element).parent().attr("id")," rimosso da html");
  updateHours();
  refreshChartByFilter();
};

function colorSchemeArea(list){
  var colors = [];
  list.forEach(function(e,i){
    var opacity = 0.4+0.6*(1/list.length)*(i+1);
    switch (e) {
      // case "Amministrazione": colors[i]='rgba(91, 103, 112,1)'; break;
      case "Architettura": colors[i]='rgba(255, 163, 0,1)'; break;
      // case "Computi": colors[i]='rgba(91, 103, 112,0.7)'; break;
      case "DEGW": colors[i]='rgba(218, 41, 28,1)'; break;
      case "DDLAB": colors[i]='rgba(0, 75, 135,0.7)'; break;
      case "Eclettico": colors[i]='rgba(151, 27, 47,1)'; break;
      case "Grafica": colors[i]='rgba(60, 213, 46,1)'; break;
      case "Ingegneria": colors[i]='rgba(255, 163, 0,0.7)'; break;
      // case "Marketing": colors[i]='rgba(60, 213, 46,0.7)'; break;
      // case "Project Management": colors[i]='rgba(91, 103, 112,1)'; break;
      // case "Pratiche": colors[i]='rgba(91, 103, 112,1)'; break;
      // case "Sicurezza": colors[i]='rgba(91, 103, 112,1)'; break;
      default: colors[i]='rgba(91, 103, 112,'+opacity+')';
    }
  });
  return colors;
};
function colorSchemeJobId(list){
  var colors = [];
  list.forEach(function(e,i){
    var opacity = 0.4+0.6*(1/list.length)*(i+1);
    switch (e) {
      case "AMMINISTRAZIONE": colors[i]='rgba(91, 103, 112,1)'; break;
      case "RICERCA SVILUPP": colors[i]='rgba(91, 103, 112,0.7)'; break;
      default: colors[i]='rgba(255, 163, 0,'+opacity+')';
    };
  });
  return colors;
};
function setBackgroundColor(list,colorScheme){
  var backgroundColor=[];
  switch (colorScheme) {
    case 'area': backgroundColor = colorSchemeArea(list); break;
    case 'jobId': backgroundColor = colorSchemeJobId(list); break;
    default:
      list.forEach(function(e,i){
        var opacity = 0.4+0.6*(1/list.length)*(i+1);
        backgroundColor[i]='rgba(91, 103, 112,'+opacity+')';
      });
  };
  return backgroundColor;
};

function userData(year,month,day){
  var firstDay = new Date(year,month,day);
  var theseRows = timeSheetData.rows.filter(function(e){ return new Date(e.dateRecord) > firstDay });  //console.log(theseRows);
  var chartJsdata = setChartJsData(theseRows,'jobId','toNumber',null);
  return chartJsdata;
};
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

function SetDoughnutChart(id,thisData,options){
  $('#'+id).html(null);
  $('#'+id).append('<canvas id="'+id+'-canvas"></canvas>');
  var ctx = $('#'+id+'-canvas')[0].getContext('2d');
  var data = setDoughnutData(thisData);
  var thisChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  });
  myCharts.doughnut.charts.push({id:id,controller:thisChart});
  function setDoughnutData(data){
    var chartData = {
      datasets: [{ data:data.data, backgroundColor:data.backgroundColor }],
      labels: data.labels
    };
    return chartData;
  };
};
function SetBarChart(id,thisData,options){
  var chartHeight = (thisData.labels.length*20)+200;
  $('#'+id).attr('style','height:'+chartHeight+'px');
  $('#'+id).html(null);
  $('#'+id).append('<canvas id="'+id+'-canvas"></canvas>');

  var ctx = $('#'+id+'-canvas')[0].getContext('2d');
  var data = setBarData(thisData);
  var thisChart = new Chart(ctx, {
    type: 'horizontalBar', //bar or horizontalBar
    data: data,
    options: options
  });
  myCharts.bar.charts.push({id:id,controller:thisChart});
  function setBarData(data){
    var chartData = {
      datasets: [{ data:data.data, backgroundColor:data.backgroundColor, label:"Data" }],
      labels: data.labels
    };
    return chartData;
  };
};
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(function(dataset){ dataset.data.push(data) });
  chart.update();
};
function removeData(chart){
  chart.data.labels.pop();
  chart.data.datasets.forEach(function(dataset){ dataset.data.pop() });
  chart.update();
};
function sortObjectArrayByString(list,key){
  list.sort(function(a, b){
    var x = a[key].toLowerCase();
    var y = b[key].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });
  return list;
};

function setSelectOptionsUsers(id,list){
  $('#'+id).html(null);
  $('#'+id).append("<option value='default'>choose one</option>");
  list.forEach(function(e){
    $('#'+id).append("<option value='"+e.userId+"'>"+e.name+" "+e.surname+"</option>");
  });
};
function setSelectOptionsJobs(id,list){
  $('#'+id).html(null);
  $('#'+id).append("<option value='default'>choose one</option>");
  list.forEach(function(e){
    $('#'+id).append("<option value='"+e.code+"'>"+e.codeNumber+" - "+e.description+"</option>");
  });
};
function getPL(){
  var queryObj = {userRole:'timesheetPL'};
  $.post('/users', queryObj, function(response) {
    sortObjectArrayByString(response.docs,'name');
    setSelectOptionsUsers('filter-pl',response.docs);
  },'json');
};
function getUsers(){
  var queryObj = {};
  $.post('/users', queryObj, function(response) {
    sortObjectArrayByString(response.docs,'name');
    timeSheetUsers = response.docs;
  },'json');
};
function getJobsPL(userId){
  timeSheetPL.jobs = timeSheetJobs.filter(function(e){ return e.pl == userId });
  setSelectOptionsJobs('filter-chart-job-pl-dettagli',timeSheetPL.jobs);
};
function getJobRows(jobId,callback){
  $.post('/getRecordsByJobId', {jobId:jobId}, function(response) {
    callback(response);
  },'json');
}

function setChartJsData(records,groupBy,settings,thisType){
  if (thisType == 'isString'){ sortObjectArrayByString(records,groupBy) }
  else { records.sort(function(a, b){return a[groupBy] - b[groupBy]}) };

  var labels = setDataLabels(records,groupBy,settings);
  var data = setDataData(labels,records,groupBy);
  switch (groupBy) {
    case 'jobId':
      return {data:data,labels:labels, backgroundColor:setBackgroundColor(labels,'jobId')};
      break;
    case 'area':
      return {data:data,labels:labels, backgroundColor:setBackgroundColor(labels,'area')};
      break;
    default:
      return {data:data,labels:labels, backgroundColor:setBackgroundColor(labels,'default')};
  }
};
function setDataLabels(list,key,settings){
  var labels = [];
  list.forEach(function(e){
    if(settings=='toNumber'){
      if(Number(e[key])){ labels.push(Number(e[key])) }
      else { labels.push(e[key]) };
    }
    else { labels.push(e[key]) };
  });
  return unique(labels);
};
function setDataData(labels,rows,key){
  var data = [];
  for (var i = 0; i < labels.length; i++) {
    var thisLabelRows = rows.filter(function(e){return e[key] == labels[i]});
    var hours = 0;
    for (var n = 0; n < thisLabelRows.length; n++){
      hours = hours + thisLabelRows[n].hours;
    };
    data[i]=hours.toFixed(0); // arrotonda a zero decimali
  };
  return data;
};

function refreshChartByFilter_pl_dettagli(){
  var thisJobNumber = $('#filter-chart-job-pl-dettagli').val();
  var thisJob = timeSheetPL.jobs.filter(function(e){return e.codeNumber == thisJobNumber})[0];

  getJobRows(thisJob.code,function(response){
    var thisYear = $('#filter-chart-year-pl-dettagli').val();
    var thisMonth = $('#filter-chart-month-pl-dettagli').val();
    var startDate = new Date(thisYear,thisMonth,01);

    theseRows = response.docs.filter(function(e){ return new Date(e.dateRecord) >= startDate }); //console.log('theseRows: ',theseRows);
    theseRows.forEach(function(row){
      var thisUser = timeSheetUsers.filter(function(user){ return user.userId == row.userId })[0];
      if(!thisUser){
        console.log('utente storico non presente tra gli utenti attivi di adhoc');
        thisUser = {name:row.userId, surname:'', area:'da definire'};
      }
      row.name = thisUser.name+' '+thisUser.surname;
      // row.area = setUserArea(thisUser.area);
      row.area = setUserArea(row.area);
      var thisActivity = thisJob.activities.filter(function(e){ return e.code == row.activityId })[0];
      if(!thisActivity){
        console.log('attività non più presente tra quelle disponibili per il job');
        row.activityDescription = row.activityId;
      }
      else { row.activityDescription = thisJob.activities.filter(function(e){ return e.code == row.activityId })[0].description };
    });
    var theseOptions = myCharts.doughnut.options;

    theseOptions.title.text = 'Attività';
    var chartJsdata = setChartJsData(theseRows,'activityDescription',null,'isString');
    SetDoughnutChart('content-data-chart-pl-dettagli-attività',chartJsdata,theseOptions);

    theseOptions.title.text = 'Area';
    chartJsdata = setChartJsData(theseRows,'area',null,'isString');
    SetDoughnutChart('content-data-chart-pl-dettagli-area',chartJsdata,theseOptions);

    theseOptions = myCharts.bar.options;
    theseOptions.title.text = 'Persone';
    chartJsdata = setChartJsData(theseRows,'name',null,'isString');
    SetBarChart('content-data-chart-pl-dettagli-persone',chartJsdata,theseOptions);
  });
};
function refreshChartByFilter_pl_commesse(){
  $('#content-data-chart-pl-commesse').html(null);
  var progressHtml = [
    '<div id="progress-pl-commesse" class="progress">',
      '<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div>',
    '</div>'
  ].join('\n');
  $('#content-data-chart-pl-commesse').append(progressHtml);

  var theseRows = [];
  var theseJobs = timeSheetPL.jobs;
  var i=0;
  theseJobs.forEach(function(thisJob){
    getJobRows(thisJob.code,function(response){
      i++;
      theseRows = theseRows.concat(response.docs); // console.log('theseRows: ',theseRows);
      if(i==theseJobs.length){
        $('#progress-pl-commesse').toggle();

        var thisYear = $('#filter-chart-year-pl-commesse').val();
        var thisMonth = $('#filter-chart-month-pl-commesse').val();
        var startDate = new Date(thisYear,thisMonth,01);
        theseRows = theseRows.filter(function(e){ return new Date(e.dateRecord) >= startDate });

        var theseOptions = myCharts.bar.options;
        theseOptions.title.text = 'Commesse attive';
        chartJsdata = setChartJsData(theseRows,'jobId','toNumber','isNumber');
        SetBarChart('content-data-chart-pl-commesse',chartJsdata,theseOptions);
      };
    });
  });
};

function newEmployee(){
  var obj = {
    name:'',
    surname:'',
    userId:'',
    // auth:'admin'
  };
  $.post('/newEmployee', obj, function(response) {
    console.log("response: ",response);
  },'json');
}
