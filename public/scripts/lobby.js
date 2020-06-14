console.log('running lobby')

var socket = io();

let p2 = document.getElementById('p2')

socket.on('connect', function(){
    socket.emit('adduser', prompt("What's your name: "));
});

socket.on('updatechat', function (username, data) {
    $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
});

socket.on('updaterooms', function (rooms, current_room) {
    $('#rooms').empty();
    let curRoom = document.getElementById('myroom')
    curRoom.innerHTML = current_room;

    console.log(socket);
    let p1 = document.getElementById('p1')

    $.each(rooms, function(key, value) {
        if(value == current_room){
            $('#rooms').append('<div>' + value + '</div>');
        }
        else {
            $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
        }
    });
});

function switchRoom(room){
    socket.emit('switchRoom', room);
}

$(function(){
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

    $('#roombutton').click(function(){
        var name = $('#roomname').val();
        console.log("fuck")
        console.log($('#roomname').val())
        $('#roomname').val('');
        socket.emit('create', name)
    });

    $('#begindate').click(function(){
        console.log("starting date")
        // Join game
        window.location.href="/char"
    });
});