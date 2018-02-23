// When the user clicks anywhere outside of the modal, close it
var email = "{{email}}";

window.onclick = function(event) {
  if (event.target == document.getElementById('modal-login')) { $('#modal-login').css('display','none') };
  if (event.target == document.getElementById('modal-password-forgot')) { $('#modal-password-forgot').css('display','none') };
  if (event.target == document.getElementById('modal-password-reset')) { $('#modal-password-reset').css('display','none') };
};

$(document).ready(function(){
  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode; console.log(isIE);
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
    getImageProfile($("input[name='email']")[0].value);
    $('#password-forgot').attr("onClick","forgotPassword()");
    $('#button-password-reset').attr("onClick","saveNewPassword()");
    $("input[name='email']").attr("onChange","getImageProfile(this.value)");
  };
});

function getImageProfile(thisValue){
  $.getJSON( "/userby/"+thisValue, function( doc ) {
    $("#imageProfile").attr("src",doc[0].imageProfile);
    console.log(doc[0].imageProfile);
  });
};
function forgotPassword(){
  $('#modal-login').css('display','none');
  $('#modal-password-forgot').css('display','block');
};
function resetPassword(){
  var obj = {email:$("input[name='password-email']")[0].value};
  $.post('/passwordSendmail', obj, function(response) { },'json');
};
function saveNewPassword(){
  var obj = {
    email:email,
    password:$("input[name='newPassword']")[0].value
  };
  $.post('/passwordSave', obj, function(response) { },'json');
  alert("New Password saved");
  $('#modal-password-reset').css('display','none');
  $('#modal-login').css('display','block');
};
function activateButton(id){
  var newPassword = $("input[name='newPassword']")[0].value;
  var repeatedPassword = $("input[name='repeatPassword']")[0].value;

  if(repeatedPassword == newPassword){
    $(id).removeAttr("disabled");
    console.log("coincidono: ",id);
  } else {
    $(id).attr("disabled","true");
  }
};
