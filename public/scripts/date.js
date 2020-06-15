// Core dating logic goes here!
console.log("running date")

var socket = io()
var mode = 'waiting'
setMode('waiting', null, null)


function setMode(newMode, question, choices)
{
    mode = newMode
    let instruction = document.getElementById("instruction")
    let questionHTML = document.getElementById("question")
    if (mode == "waiting")
    {
        instruction.innerHTML = "<p>WAITING FOR <b>" + getUsername() + "</b></p>"
    }
    else if (mode == "question")
    {
        instruction.innerHTML = "<p>ASK A QUESTION TO <b>" + getUsername() + "</b></p>"
    }
    else if (mode == "answer")
    {
        instruction.innerHTML = "<p>ANSWER THE QUESTION FROM <b>" + getUsername() + "</b></p>"
    }
    else if (mode == "guess")
    {
        instruction.innerHTML = "<p>GUESS THE ANSWER  <b>" + getUsername() + "</b> PUT FOR THE QUESTION:</p>"
    } 
    if (mode != "question" && mode != "waiting")
    {
        questionHTML.innerHTML = '<p>"' + question + '"</p>'
    }
    else
    {
        questionHTML.innerHTML = ''
    }
    if (mode != "waiting")
    {
        $("#answer1").show();
        $("#answer2").show();
        $("#answer3").show();
        document.getElementById("answer1").innerHTML = choices[0]; 
        document.getElementById("answer2").innerHTML = choices[1]; 
        document.getElementById("answer3").innerHTML = choices[2]; 
    }
    else
    {
        $("#answer1").hide();
        $("#answer2").hide();
        $("#answer3").hide();
    }
}

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

var username = getUsername()
var isPlayerOne = false

var charP1, charP2

socket.emit('loaded', username)
var players = {}

socket.on('questionsStart', function (game) {
    players = game.players
    let sortedPlayers = Object.keys(game.players).sort()
    let playerOne = sortedPlayers[0]
    isPlayerOne = (username == playerOne)
    charP1 = game.players[sortedPlayers[0]].character
    charP2 = game.players[sortedPlayers[1]].character
    console.log(charP1)
    console.log(charP2)
    $("#char1img").attr("src", charP1)
    $("#char2img").attr("src", charP2)
})

socket.on('questionRound', function (data) {
    document.getElementById('title').innerHTML = data.score
    let isMyTurn = (data.currRound % 2 == 1 && !isPlayerOne) || (data.currRound % 2 == 0 && isPlayerOne)
    if (isMyTurn)
    {
        setMode('question', null, data.questions)
    }
    else
    {
        setMode('waiting', null, null)
    }
})

socket.on('answerRound', function (data) {
    let isMyTurn = (data.currRound % 2 == 1 && !isPlayerOne) || (data.currRound % 2 == 0 && isPlayerOne)
    if (isMyTurn)
    {
        setMode('guess', data.question, data.answers)
    }
    else
    {
        setMode('answer', data.question, data.answers)
    }
})

socket.on('guessInfo', function (guesses) {
    let names = Object.keys(guesses)
    let myGuess = guesses[username]
    let theirGuess = ''
    if (names[0] == username)
    {
        theirGuess = guesses[names[1]]
    }
    else
    {
        theirGuess = guesses[names[0]]
    }
    document.getElementById('myGuess').innerHTML = myGuess
    document.getElementById('theirGuess').innerHTML = theirGuess
    console.log(myGuess)
    console.log(theirGuess)
})

socket.on('gameEnd', function (score) {
    if (score > 6)
    {
        window.location.href = '/Assets/victory.png'
    }
    else
    {
        window.location.href = '/Assets/defeat.png'
    }
})

function toggleAudio() {
    var sound = document.getElementById("sound");
    return sound.paused ? sound.play() : sound.pause();
}

$(function() {
    $('.selectOpt').click( function(event) {
        let choice = $(this).data('opt')

        socket.emit('selectOpt', choice)
        setMode('waiting', null, null)
    })
})