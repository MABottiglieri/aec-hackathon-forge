window.onclick = function(event) {
  if (event.target == document.getElementById('modal-login')) { $('#modal-login').css('display','none') };
  if (event.target == document.getElementById('modal-password-forgot')) { $('#modal-password-forgot').css('display','none') };
  if (event.target == document.getElementById('modal-password-reset')) { $('#modal-password-reset').css('display','none') };
};

$(document).ready(function(){
  $('#button-save').attr("onClick","saveNewPassword()");

  $("input[name='newPassword']").attr("onKeyup","checkPassword()");
  $("input[name='repeatNewPassword']").attr("onKeyup","checkPassword()");
});

function saveNewPassword(){
  alert("New Password saved");
  var obj = {
    _id:_id,
    password:$("input[name='newPassword']")[0].value
  };
  $.post('/passwordSave', obj, function(response) {
    alert(response);
  },'json');
};

function checkPassword(){
  // var oldPassword = $("input[name='oldPassword']")[0].value; console.log("oldPassword: ",oldPassword);
  var newPassword = $("input[name='newPassword']")[0].value; console.log("newPassword: ",newPassword);
  var repeatNewPassword = $("input[name='repeatNewPassword']")[0].value; console.log("repeatNewPassword: ",repeatNewPassword);

  if(repeatNewPassword == newPassword){
    $('#button-save').removeAttr("disabled");
    console.log("le password coincidono: si può salvare");
  } else {
    $('#button-save').attr("disabled","true");
  }
};
