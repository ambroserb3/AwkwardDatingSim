var socket = io()

function getUsername() {
  var name = "username=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

$(function(){
    $('.selectChar').click( function(event) {
    	let choice = $(this).data('char')
      socket.emit('selectChar', {choice: choice, username: getUsername()})

    	window.location.href = '/date'
    })
})