var socket = io()

$(function(){
    $('.selectChar').click( function(event) {
    	let choice = $(this).data('char')
    	socket.emit('selectChar', choice)

    	window.location.href = '/date'
    })
})