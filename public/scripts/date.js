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
    if (mode != "question")
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
    isPlayerOne = username == playerOne
})

socket.on('setRound', function (data) {

})


$(document).ready(function()
{	
	//function to load for ready
});

$.getJSON("Assets/dating.json", function(json) {
	let cat = chooseCategory(json)
	chooseQuestion(cat);
	answerpool(cat)
});

function chooseQuestion(category){
	//need to feed category as input as well
	let r = getRandom(0, category.Questions.length)
    return category.Questions[r]
}

function chooseCategory(json){
	// console.log(json.Categories.length)
	// console.log(r)
	let obj_keys = Object.keys(json.Categories)
	let r = getRandom(0, obj_keys.length)

	let category = json.Categories[obj_keys[r]]
	// document.getElementById("cat").innerHTML = json.Categories[r]; 
	return category
}

function answerpool(category){
	let answers = []
	for (let i = 0; i <=3; i++) {
			let new_answer = ""
			do {
				let r = getRandom(0, category.Answers.length)
				new_answer = category.Answers[r]
			} while (answers.includes(new_answer))
			answers.push(new_answer)
		}
	return answers
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}




///////////////////////////////////////////////////////////
var socket = io();

socket.on('game', function (data) {
    render(data);
});

socket.on('info', function (data) {
    renderInfo(data);
});

function render(data) {
    var movingPlayer;
    var waitingPlayer;

    //get all operator buttons
    var button = document.getElementsByTagName('button');
    var buttonList = Array.prototype.slice.call(button);

    //set styling for moving player
    if (data.playerA.isPlaying) {
        movingPlayer = document.getElementById('player-a');
        waitingPlayer = document.getElementById('player-b');
    } else {
        movingPlayer = document.getElementById('player-b');
        waitingPlayer = document.getElementById('player-a');
    }
    movingPlayer.className = 'active';
    waitingPlayer.className = '';

    if (data.movingPlayerId === socket.id) {
        buttonList.forEach(function (button) {
            button.disabled = false;
        });
    } else {
        buttonList.forEach(function (button) {
            button.disabled = true;
        });
    }

    if (data.playerB.numbers && data.playerA.numbers && data.operators) {

        var playerA = data.playerA.numbers.map(function (numberA, index) {
            return (`<div><div>${numberA}</div></div>`)
        }).join(' ');

        var operator = data.operators.map(function (operator, index) {
            return (`<div><div>${operator}</div></div>`)
        }).join(' ');

        var playerB = data.playerB.numbers.map(function (numberB, index) {
            return (`<div><div>${numberB}</div></div>`)
        }).join(' ');

        var div_playerA = document.getElementById('container-a');
        div_playerA.innerHTML = playerA;

        var div_operators = document.getElementById('container-operator');
        div_operators.innerHTML = operator;

        var div_playerB = document.getElementById('container-b');
        div_playerB.innerHTML = playerB;

        var div_play = document.getElementById('playground');
        div_play.scrollTop = div_play.scrollHeight;
    }
}

function nextMove(operator) {
    socket.emit('next-move', operator);
}

function renderInfo(data) {
    var div_info = document.getElementById('info-box');
    div_info.innerHTML = data;
}

function toggleAudio() {
    var sound = document.getElementById("sound");
    return sound.paused ? sound.play() : sound.pause();
}
