const path = require('path')
const http = require('http');
const express = require('express')
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server)

const PORT = process.env.PORT || 5000
//////////////////////////////////////////////////////////////////////

///////////////////////// Run App and Web Sockets ///////////////////////////////
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/lobby', function(req, res) {
  res.render('pages/rooms', { });
});
app.get('/char', function(req, res) {
  res.render('pages/characterselect', { });
});
app.get('/date', function(req, res) {
  res.render('pages/date', { });
});

var usernames = {};
var rooms = {};

class Player {
  constructor(username) {
    this.username = username
  }
}

class Game {
  constructor(name) {
    this.name = name
    this.players = {}
  }

  addPlayer(username, player) {
    this.players[username] = player
  }

  removePlayer(username) {
    delete this.players[username]
  }

  get usernames() {
    return Object.keys(this.players)
  }
}


var randomNumber = Math.floor(Math.random() * (21 - 2 + 1)) + 2;
var newNumber = 0;
var info = ' ';

function executeNextMove(movingPlayer, waitingPlayer) {
  number = waitingPlayer.numbers[waitingPlayer.numbers.length-1];
  operator = game.operators[game.operators.length-1];
  newNumber = calcNewNumber(number, operator);
  movingPlayer.numbers.push(newNumber);
  movingPlayer.isPlaying = false;
  waitingPlayer.isPlaying = true;

  game.movingPlayerId = waitingPlayer.id;
  info_waiting = '...waiting for ' + waitingPlayer.name + ' to a move!';
  info_moving = 'Please make a move ' + waitingPlayer.name + '!'
  
  io.sockets.connected[movingPlayer.id].emit('info', info_waiting);

  if(waitingPlayer.id != 'notAvailable') {
      io.sockets.connected[waitingPlayer.id].emit('info', info_moving);
  }
  io.sockets.emit('game', game);
}

function calcNewNumber(number, operator){
  newNumber = (number + operator) / 3;
  return Math.round(newNumber);
};

function getCurrentPlayerName(game) {
  return (game.movingPlayerId === game.playerA.id) ? game.playerA.name : game.playerB.name;
}

function togglePlayer() {
   game.movingPlayerId === game.playerA.id ? game.playerA.id : game.playerB.id; 
}

function leaveRoom(socket) {
  oldroom = socket.room
  if (oldroom != null) {
    socket.leave(oldroom)
    socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room')
    socket.room = null
    rooms[oldroom].removePlayer(socket.player.username)
  }
}

function joinRoom(socket, roomName) {
  socket.join(roomName)
  socket.emit('updatechat', 'SERVER', 'you have connected to ' + roomName)
  socket.broadcast.to(roomName).emit('updatechat', 'SERVER', socket.username + ' has joined this room')
  socket.emit('updaterooms', Object.keys(rooms), roomName)
  socket.room = roomName
  rooms[roomName].addPlayer(socket.player)
  socket.broadcast.to(roomName).emit('userlist', rooms[roomName].usernames)
}

io.sockets.on('connection', function(socket) {
    socket.on('adduser', function(username) {
        socket.username = username;
        socket.player = new Player(username)
        socket.room = null
        socket.emit('updaterooms', Object.keys(rooms), null)
        console.log("A USER HAS been added")
    });

    socket.on('create', function(room) {
        game = new Game(room, {})
        rooms[room] = game;
        joinRoom(socket, room)
        socket.broadcast.emit('updaterooms', Object.keys(rooms), null)
    });

    socket.on('sendchat', function(data) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom) {
        leaveRoom(socket)
        joinRoom(socket, newroom)
    });

    socket.on('next-move', function(data){ 
        game.operators.push(parseInt(data));
        if(game.movingPlayerId === game.playerA.id) {
            executeNextMove(game.playerA, game.playerB);
        } else {
            executeNextMove(game.playerB, game.playerA);
        }
        if (newNumber === 1) {
            //because movingPlayerId was just switched
            if (game.playerB.id.match(game.movingPlayerId)){
                info = "The winner is Player A";
            } else {
                info = "The winner is Player B";
            }
            io.sockets.emit('info', info);
            //io.close();
        }
    });
  
    socket.on('disconnect', function() {
        //remove player from list
        leaveRoom(socket)
        //TODO error handling for game
        //io.close();
    });
 });


server.listen(PORT, () => console.log("Server started!", `Listening on ${ PORT }`));
////////////////////////////////////////////////////////////////////////////////////////////




