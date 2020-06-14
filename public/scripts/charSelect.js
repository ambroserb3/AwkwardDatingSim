var socket = io()

$(function(){
    $('.selectChar').click( function(choice) {
    	socket.emit('selectChar', choice)

    	window.location.href = '/date'
    })
})