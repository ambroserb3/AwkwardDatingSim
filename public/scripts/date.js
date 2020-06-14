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
        instruction.innerHTML = "<p>WAITING</p>"
    }
    else if (mode == "question")
    {
        instruction.innerHTML = "<p>ASK A QUESTION</p>"
    }
    else if (mode == "answer")
    {
        instruction.innerHTML = "<p>ANSWER THE QUESTION</p>"
    }
    else if (mode == "guess")
    {
        instruction.innerHTML = "<p>GUESS THE ANSWER</p>"
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
        document.getElementById("answer1").disabled = false
        document.getElementById("answer2").disabled = false
        document.getElementById("answer3").disabled = false
        document.getElementById("answer1").innerHTML = choices[0]; 
        document.getElementById("answer2").innerHTML = choices[1]; 
        document.getElementById("answer3").innerHTML = choices[2]; 
    }
    else
    {
        document.getElementById("answer1").disabled = true
        document.getElementById("answer2").disabled = true
        document.getElementById("answer3").disabled = true
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

socket.emit('loaded', username)
var players = {}

socket.on('questionsStart', function (game) {
    players = game.players
    let playerOne = Object.keys(game.players).sort()[0]
    isPlayerOne = (username == playerOne)
})

socket.on('questionRound', function (data) {
    document.getElementById('title').innerHTML = data.score
    if (data.currRound % 2 == 1 || isPlayerOne)
    {
        setMode('question', null, data.questions)
    }
    else
    {
        setMode('waiting', null, null)
    }
})

socket.on('answerRound', function (data) {
    if (data.currRound % 2 == 1 || isPlayerOne)
    {
        setMode('guess', data.question, data.answers)
    }
    else
    {
        setMode('answer', data.question, data.answers)
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