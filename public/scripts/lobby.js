console.log('running lobby')

var socket = io();

var my_room = null

socket.on('connect', function(){
    let username = prompt("What's your name: ")
    socket.emit('adduser', username);
    document.cookie = "username=" + username
});

socket.on('updatechat', function (username, data) {
    $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
});

socket.on('updaterooms', function (rooms, current_room) {
    $('#rooms').empty();
    let curRoom = document.getElementById('myroom')
    if (current_room != null)
    {
        curRoom.innerHTML = current_room;
        my_room = current_room
    }

    $.each(rooms, function(key, value) {
        if(value == my_room){
            $('#rooms').append('<div>' + value + '</div>');
        }
        else {
            $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
        }
    });
});

socket.on("userlist", function(usernames) {
    console.log(usernames)
    let toDisplay = ""
    for (const name of usernames) {
        toDisplay = toDisplay + name + "<br />"
    }

    document.getElementById('p1').innerHTML = toDisplay
    // document.getElementById('p2').innerHTML = usernames[1]
});

socket.on("dateStart", function(game) {
    window.location.href="/char"
})

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
        console.log('this happened')
        socket.emit('startDate')
    });
});