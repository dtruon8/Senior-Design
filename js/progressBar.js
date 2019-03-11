//Global variables
var currentLen = [];	//tracks the current width of each progress bar
var numQs = [];			//the number of questions in each section
var totalQs = 0;
var done = false;		//true when every (required) answer has been answered. false otherwise
var saved = false;		//keeps track of whether assessment progress has been saved. unimplemented currently
var answeredQs = 0;		//used to determine if the assessment is complete
var answers = [];		//unused
var questionAnswered = [];	//keeps track of whether each question is answered.
var numberAnswered = [];	//the number of questions in a section that have been answered. used in deternining progbar len
var maxAns = 5;			//the maximum number of answers for any question. may automate getting this later
var numSec;				//the number of sections in the assessment. 
						//used for determining the length of numQs and questionAnswered
var deviceScore = [0, 0, 0, 0];	//unused, will keep track of the score for each device


/*
Function initialze() is run  on page load. 
Adds onclick="answerSelected(this.id)" to all answers
Determines the number of sections
Initializes the width of all progress bars to 0
Counts the number of questions in each section 
Initializes questionAnswered to false for every question
*/
function initialize(){
	//console.time('initialize');
	
	/*
	var addClick = document.getElementsByClassName("A");
	for (var i = 0; i < addClick.length; i++){
		addClick[i].setAttribute("onclick", "answerSelected(this.id)");
	}*/ //replacing this with jquery
	numSec =  document.getElementsByClassName("pbar").length;
	console.log("Number of Sections: " + numSec);
	numQs.length = numSec;
	//var width = 400;
	////console.log(width);
	var bars = document.getElementsByClassName("bar");
	for (var i = 0; i < numSec; i++){
		//set the width of the progress bars,
		//set the current length of all the progress bars as 0,
		//set the number of questions in each section,
		//and fill the questionsAnswered array with false
		currentLen[i] = 0;
		//bars[i].style.width = (width) + "px";
		var secNum = "s" + (i+1);	//s1 when i=0, s2 when i=1, etc.
		var section = document.getElementById(secNum);
		var secNumQ = section.getElementsByClassName("Qn").length; //number of questions in section secNum
		//console.log(secNumQ)
		var optionalNum = section.getElementsByClassName("optional").length;
		var commentNum = section.getElementsByClassName("comment").length;
		//console.log("Number of optional questions: " + optionalNum);
		//console.log("Number of commentq: " + commentNum);
		secNumQ -= optionalNum;
		secNumQ -= commentNum;	//don't count comments or optional questions in the number of questions
		//console.log(secNumQ);
		totalQs += secNumQ;
		numQs[i] = secNumQ;
		var tempArray = [];
		tempArray.length = secNumQ;	//sets the length of the tempArray to the number of questions in this section
		tempArray.fill(false, 0, secNumQ); 
		numberAnswered[i] = 0;
		questionAnswered.push(tempArray);	//equivalent to questionAnswered[i] = tempArray;
	}
	console.log("numQs: " + numQs);
	//console.log(totalQs);
	console.log("Questions Answered");
	console.log(questionAnswered);
	console.log(numberAnswered);
	
	////console.log("CurrentLen: " + currentLen);
	//getAnswers();
	//console.timeEnd('initialize');
}

/*
This function animates the increasing of a progress bar of a particular section.
The parameters start and stop are the start and end values of the animation, repectively.
*/
function increaseBar(section, start, stop){
	section += 1;
	//console.log("progbar" + section);
	var bar = document.getElementById("progbar" + section);	//progbar# 
	var barTxt = document.getElementById("barText" + section);
	//console.log(start);
	var width = ~~start;	//equivalent to flooring the start value 
	//console.log("Starting width: " + width);
	var id = setInterval(frame, 12);	//12 ms animation
	function frame() {
		if (width >= stop) {	// to ensure that if stop is #.### it stops at #.000
			clearInterval(id);
		} else {
			width++;
			bar.style.width = width + '%'; 
			barTxt.innerHTML = width + '%'; 
		}
	}
	
}

/*
Animates the decreasing of a progress bar when a checkbox is unchecked
*/
function decreaseBar(section, start, stop){
	section += 1;
	//console.log("progbar" + section);
	//currentLen[section-1] = stop;
	var bar = document.getElementById("progbar" + section);	//progbar# 
	var barTxt = document.getElementById("barText" + section);
	var width = start;
	//console.log("Starting width: " + width);
	var id = setInterval(frame, 12);
	function frame() {
		if (width <= stop) {
			clearInterval(id);
		} else {
			width--;
			if (width < stop) width = stop; //to ensure the percentage doesn't go lower than the starting percentage
			bar.style.width = width + '%'; 
			barTxt.innerHTML = Math.ceil(width) + '%'; //to match the percentage increaseBar produces
		}
	}
}
	
/*
Checks whether the bar width should be increased or decreased. 
Calls the appropriate function and then changes currentLen
*/
function changeBar(section, len){
	var curLen = currentLen[section];
	//console.log("Length Before: " + curLen);
	//console.log("Length After: " + len);
	if (curLen < len) {
		//console.log("Calling increaseBar");
		increaseBar(section, curLen, len);
	} else {
		//console.log("Calling decreaseBar");
		decreaseBar(section, curLen, len);
	}
	currentLen[section] = len;
}

/*
Will be used to compute each device's score.
*/
function computeScores(){
	//console.log("In computeScores");
}

/* Unused currenly.
The outer for loop iterates through the number of questions.
The inner for loop sets aName to be of the form "q#a#".
If there is an element with id aName, that element is put in the answers array
in position [i][j].
*/
function getAnswers(){
	var tempAns = [];
	var numAnswers = 0;
	for (var i = 0; i < numQs; i++){
		for (var j = 0; j < maxAns; j++){
			var aName = 'q' + (i+1) + 'a' + (j+1);
			////console.log(aName);
			var elem = document.getElementById(aName);
			////console.log(elem);
			if (typeof(elem) != 'undefined' && elem != null) {
				tempAns.push(elem);
				numAnswers++;
				////console.log(tempAns);
			}
			////console.log(elem);
		}
		////console.log(tempAns);
		answers.push(tempAns);
		tempAns = [];
	}
	//console.log(numAnswers);
	//console.log(answers);
}

/*
Called when a question (radio or checkbox) is answered
Takes the id of an element as a parameter
Strips out the section, question, and answer numbers
Checks if the question was already answered
If it wasn't, it is marked as answered and changeBar is called
If it was, and the answer was a checkbox, checks whether any other answer to the question is selected.
If there are no answers selected, changeBar is called to decrease the width of the progress bar.
*/
function answerSelected(id){
	var sidx = id[1]-1;	//section number
	var qidx = id[3]-1; //question index
	var aidx = id[5]-1; //answer number
	console.log("Section " + (sidx+1) + ", Question " + (qidx+1) + ", Answer " + (aidx+1));
	console.log("Was this question already answered? " + questionAnswered[sidx][qidx]);
	
	var elem = document.getElementById(id);
	//console.log("Answer selected");
	if (!questionAnswered[sidx][qidx]){
		questionAnswered[sidx][qidx] = true;
		answeredQs++;
		numberAnswered[sidx]++;
		console.log("Question Answered and number answered");
		console.log(questionAnswered);
		console.log(numberAnswered);
		//var len = currentLen[sidx] + 100 / numQs[sidx];
		if(!enableAns.includes(id) && !upload){
			var len = numberAnswered[sidx] / numQs[sidx] * 100;
			if (len > 100) len = 100;	//caps the length at 100
			changeBar(sidx, len);
		}
	}
	else if (questionAnswered[sidx][qidx] && elem.type == "checkbox"){
		var othersChecked = false;
		//iterate through all answers to the question.
		//if any are checked, the progress bar will not be changed.
		//if no other answer is checked, then decrease the progbar
		for (var i = 1; i <= maxAns; i++){
			var otherAnswer = "s" + (sidx+1) + "q" + (qidx+1) + "a" + i;
			//console.log("Answer id in for loop: " + otherAnswer);
			var elem = document.getElementById(otherAnswer);
			if (elem && elem.checked){
				othersChecked = true;
				break;
			}
		}
		//console.log("Others checked: " + othersChecked);
		if (othersChecked == false){
			answeredQs--;
			numberAnswered[sidx]--;
			if (done)
				done = false;
			questionAnswered[sidx][qidx] = false;
			//var len = currentLen[sidx] - 100 / numQs[sidx];
			var len = numberAnswered[sidx] / numQs[sidx] * 100;
			console.log("len: " + len);
			changeBar(sidx, len);
		}
	}
	//console.log("Number of questions answered: " + answeredQs);
	//console.log("Done yet? " + done);
}