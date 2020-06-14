// Core dating logic goes here!

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
	console.log("random number for question:" + r)
	console.log(category.Questions[r])
	document.getElementById("question").innerHTML = category.Questions[r]; 
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
	console.log(answers)
	document.getElementById("answer1").innerHTML = answers[0]; 
	document.getElementById("answer2").innerHTML = answers[1]; 
	document.getElementById("answer3").innerHTML = answers[2]; 
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
