// Core dating logic goes here!

$(document).ready(function()
{	
	//function to load for ready
});

$.getJSON("dating.json", function(json) {
	// console.log(json); // this will show the info it in firebug console
	// console.log(json.Categories.Emotional.Questions)
	let cat = chooseCategory(json)
	chooseQuestion(json);
	answerpool(json)
});

function chooseQuestion(json){
	//need to feed category as input as well
	let r = getRandom(0, json.Categories.Emotional.Questions.length)
	console.log("random number for question:" + r)
	console.log(json.Categories.Emotional.Questions[r])
	document.getElementById("question").innerHTML = json.Categories.Emotional.Questions[r]; 
}

function chooseCategory(json){
	let r = getRandom(0, json.Categories.length)
	// console.log(json.Categories.length)
	// console.log(r)
	let category = json.Categories[r]
	// document.getElementById("cat").innerHTML = json.Categories[r]; 
	return category
}

function answerpool(json){
	let answers = []
	for (let i = 0; i <=3; i++) {
			// need to prevent dupes
			console.log("hi")
			let r = getRandom(0, json.Categories.Emotional.Answers.length)
			console.log(r)
			console.log(json.Categories.Emotional.Answers[r])
			answers.push(json.Categories.Emotional.Answers[r])
		}
	console.log(answers)
	document.getElementById("answer1").innerHTML = answers[0]; 
	document.getElementById("answer2").innerHTML = answers[1]; 
	document.getElementById("answer3").innerHTML = answers[2]; 
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
