// Core dating logic goes here!

$(document).ready(function()
{	
	//function to load for ready
});

$.getJSON("dating.json", function(json) {
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

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
