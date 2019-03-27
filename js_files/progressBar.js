//Global variables
var currentLen = [];	//tracks the current width of each progress bar
var numQs = [];			//the number of questions in each section
var totalQs = 0;
var done = false;		//true when every (required) answer has been answered. false otherwise
var saved = false;		//keeps track of whether assessment progress has been saved. unimplemented currently
var started = false;	//tracks whether the user has answered a question. used to display warning
var answeredQs = 0;		//used to determine if the assessment is complete
var answers = [];		//unused
var questionAnswered = [];	//keeps track of whether each question is answered.
var numberAnswered = [];	//the number of questions in a section that have been answered. used in deternining progbar len
var maxAns = 50;			//the maximum number of answers for any question. may automate getting this later
var numSec;				//the number of sections in the assessment. 
						//used for determining the length of numQs and questionAnswered
var enableAns = {"s1q2a1": "s1q2c", "s1q3a1": "s1q3c", "s1q4a1": "s1q4c", "s1q5a1":"s1q5c", "s6q7a1":"s6q7c" };


$(function (){
	$("td").click(function (){
		var x = $(this).find("input").first();
		console.log("In this jquery function the id is " + x.prop("id"));
		document.getElementById(x.prop("id")).click();
	});
});

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
	$("input[type=radio], input[type=checkbox]").prop("checked",false);
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
		console.log(secNum);
		var section = document.getElementById(secNum);
		//console.log(section);
		var secNumQ = section.getElementsByClassName("Qn").length; //number of questions in section secNum
		console.log(secNumQ)
		var optionalNum = section.getElementsByClassName("optional").length;
		var commentNum = section.getElementsByClassName("comment").length;
		var tableNum = section.getElementsByTagName("table").length;
		console.log("Tables: " + tableNum);
		console.log("Number of optional questions: " + optionalNum);
		console.log("Number of commentq: " + commentNum);
		secNumQ -= optionalNum;
		secNumQ -= commentNum;	//don't count comments or optional questions in the number of questions
		secNumQ -= tableNum;	//don't double count questions in tables
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
	document.getElementById("defaultOpen").click();
	var y = sessionStorage.getItem("uploadSuccessful");
	console.log("This is the value of upload: " + y);
	if (sessionStorage.getItem("uploadSuccessful")){
		getAnswersFromStorage();
		console.log("uploadSuccessful");
	}
}

/*
This function animates the increasing of a progress bar of a particular section.
The parameters start and stop are the start and end values of the animation, repectively.
*/
/*function increaseBar(section, start, stop){
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
	
}*/

/*
Animates the decreasing of a progress bar when a checkbox is unchecked
*/
/*function decreaseBar(section, start, stop){
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
}*/
	
/*
Checks whether the bar width should be increased or decreased. 
Calls the appropriate function and then changes currentLen
*/
function changeBar(section){
	var len = numberAnswered[section] / numQs[section] * 100;
	if (len > 100) len = 100;
	console.log("Section " + section + "\n Len: " + len);
	var curLen = currentLen[section];
	section += 1;
	var bar = document.getElementById("progbar" + section);	//progbar# 
	var barTxt = document.getElementById("barText" + section);
	if (curLen != len){
		changeMeter(bar, curLen, len, barTxt);
	}
	//console.log("start: " + curLen + "\nStop: " + len);
	currentLen[section-1] = len;
	/*//console.log("Length Before: " + curLen);
	//console.log("Length After: " + len);
	if (curLen < len) {
		//console.log("Calling increaseBar");
		increaseBar(section, curLen, len);
	} else {
		//console.log("Calling decreaseBar");
		decreaseBar(section, curLen, len);
	}
	currentLen[section] = len;*/
}
function changeMeter(bar, start, stop, barTxt){
	var x = start < stop ? 1 : -1;
	console.log("In change meter");
	var width = start;
	//console.log("Starting width: " + start);
	//console.log("Stopping width: " + stop);
	var id = setInterval(frame, 12);
	function frame() {
		if (width === ~~stop) {
			clearInterval(id);
		} else {
			width += x;
			//console.log(width);
			if ((width > stop && x > 0) || (width < stop && x < 0)) width = ~~stop; //to ensure the percentage stays within bounds
			bar.style.width = width + '%'; 
			if (barTxt) barTxt.innerHTML = ~~width + '%';
		}
	}
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
	var a_pos = id.indexOf("a");	//find "a" in the id
	console.log("Position of a: " + a_pos);
	var qidx = Number(id.substring(3, a_pos)) - 1; //question index
	//var qidx = id[3]-1; //question index
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
		if(!upload){
			//var len = numberAnswered[sidx] / numQs[sidx] * 100;
			//if (len > 100) len = 100;	//caps the length at 100
			changeBar(sidx);
			if (numQs[sidx] == numberAnswered[sidx]){
				document.getElementsByClassName("fa-check")[sidx].style.visibility = "visible";
			}

		}		
	}
	else if (questionAnswered[sidx][qidx] && elem.type == "checkbox"){
		var othersChecked = [];
		var othersNames = [];
		var namepos = id.indexOf("a");
		console.log(namepos);
		var name = id.substring(0, namepos + 1);
		console.log(elem.name);
		//iterate through the other elements with the same name. put their boolean value into othersChecked
		//afterwards, set the value of othersChecked to either true or false
		$("input[name=" + name + "]").not("#" + id).each( function(){
			console.log(this.id);	
			othersChecked.push((this.checked) ? true : false);
		});
		console.log(othersChecked);
		othersChecked = othersChecked.includes(true) ? true : false;
		console.log(othersChecked);
		
		if (!othersChecked){
			answeredQs--;
			numberAnswered[sidx]--;
			if (done)
				done = false;
			questionAnswered[sidx][qidx] = false;
			//var len = currentLen[sidx] - 100 / numQs[sidx];
			//var len = numberAnswered[sidx] / numQs[sidx] * 100;
			//console.log("len: " + len);
			changeBar(sidx);

			var checkmark = document.getElementsByClassName("fa-check")[sidx];
			if (checkmark.style.visibility == "visible"){
				checkmark.style.visibility = "hidden";
			}
		}
	}
}

//window.onunbeforeunload = clearStorage();
var upload = false;
var saveStr = ""
var arraySum = function(arr) {
	return arr.reduce(function(acc, cur) {return acc + cur;}, 0);
}
//checks whether the number of questions that have been answered is equal to the number of 
function checkCompletion(){
	/*console.log("In checkCompletion");
	var totalAns = arraySum(numberAnswered);
	console.log(totalAns);
	var totalQ = arraySum(numQs);
	console.log(totalQ);
	done = totalQ === totalAns;
	console.log("Done yet? " + done);*/
	var submit = $(".submit_button");
	if (done){
		submit.removeClass("submit-disabled");
		submit.find("a").prop("href", "Page 3 - Results Page.html");
		stopTimer();
		sessionStorage.setItem("timer", totalSeconds);
	} else {
		submit.addClass("submit-disabled");
		submit.prop("href", "javascript:;");
		resumeTimer();
		//sessionStorage.removeItem("timer");
	}
}
function press(){
	$("#s4q2").val($("#s4q1").val());
	checkCompletion();
}
var displaymessage = false;
function closing(){
	if (!started && (done || saved))
		return null;
	else return "aaaaaaaaaaa";
}

function clearStorage(){
	localStorage.clear();
	sessionStorage.clear();
}

//Jquery
$(function(){
    window.onbeforeunload = closing;
	
	$(".selection").change(function() {
		var id = $(this).children(":selected").prop("id");
		console.log("option id: " + id);
		var  sidx = id[1]-1;	//section number
		var a_pos = id.indexOf("a");	//find "a" in the id
		var qidx = Number(id.substring(3, a_pos)) - 1;	//question index
		//var len = numberAnswered[s] / numQs[s] * 100;
		//console.log("len: " + len);
		//changeBar(s, len);
		answerSelected(id);
	});
	
	$(".A").click( function(event) {
		if (!started) {
			started = true;
		}
		var id = event.target.id;
		console.log("ID: " + id);
		var  sidx = id[1]-1;	//section number
		var a_pos = id.indexOf("a");	//find "a" in the id
		var qidx = Number(id.substring(3, a_pos)) - 1;	//question index
		console.log(a_pos);
		console.log("Was this question already answered? " + questionAnswered[sidx][qidx]);
		
		if ($(this).hasClass("limit-input")){
			var limit = 3;
			if ($(this).siblings(':checked').length >= limit){
				this.checked = false;
			}
		}
		
		
		if ($(this).hasClass("sameAns")){
			var v = event.target.value;
			console.log(v);
			$(".sameAns:checked").not(this).each(function(){
				if (this.value === v){
					$(this).prop('checked',false);
					console.log("Does it come here");
					var stopChecked = this.id;
					console.log(stopChecked);
					var s = stopChecked[1]-1;
					var q = stopChecked[3]-1;
					questionAnswered[s][q] = false;
					numberAnswered[s] -= 1;
				}
			});
			
			//var len = numberAnswered[id[1]-1] / numQs[id[1]-1] * 100;
			//if (len > 100) len = 100;	//caps the length at 100
			changeBar(id[1]-1,len);
			
			//check if all sections are complete. if so, enable the submit button.
			/*for (var i = 0; i < numSec; i++){
				if (numberAnswered[i] === numQs[i])
					
			}*/
		}
		
		if ($(this).hasClass("enableQ")) {
			console.log(id);
			var a_pos = id.indexOf("a");	//find "a" in the id
			console.log(a_pos);
			//var enabledQ = id.substring(0, a_pos) + "c";	//s#q#c for comments
			var enabledQ = enableAns[id];
			console.log(enabledQ);
			console.log(this.id);
			if (enabledQ){
				$("#" + enabledQ).prop("disabled", false);
			} else {
				$("#" + enabledQ).prop("disabled", true);
			}
			/*
			var s = id[1]-1;
			//var q = Number(id[3])+1;
			var item = "numQs" + s;
			var enabledQ = id.substring(0,3); //s#q
			enabledQ += q + "a";
			console.log(id);
			console.log(enabledQ);
			console.log("JQuery");
			if (enableAns.includes(id)) {
				$('input[name=' + enabledQ +']').prop('disabled', false);
				sessionStorage.setItem(item, numQs[s]); 
				console.log("in here");
				numQs[s] += 1;
				if (numQs[s] == numberAnswered[s]){
					document.getElementsByClassName("fa-check")[s].style.visibility = "visible";
				} else {
					document.getElementsByClassName("fa-check")[s].style.visibility = "hidden";
				}
			} else {
				$('input[name=' + enabledQ +']').prop('disabled', true);
				console.log("does it make it here");
				if ($('input[name=' + enabledQ +']').is(':checked')){
					numberAnswered[s] -= 1;
					questionAnswered[s].length -= 1;
					$('input[name=' + enabledQ +']').prop('checked', false);
				}
				var qs = sessionStorage.getItem(item);
				if (qs != null){
					numQs[s] -= 1;
					sessionStorage.removeItem(item);
				}
				if (numQs[s] == numberAnswered[s]){
					document.getElementsByClassName("fa-check")[s].style.visibility = "visible";
				} else {
					document.getElementsByClassName("fa-check")[s].style.visibility = "hidden";
				}
			}
			if (!upload){
				var len = numberAnswered[s] / numQs[s] * 100;
				console.log("len: " + len);
				changeBar(s, len);
			}*/
		}
		answerSelected(id);
		checkCompletion();
	});
	//When a question that has an answer that enables another answer is selected:
	//if the enable answer is selected: get the section and question number of the next question
	//This means that an optional question must follow the enabling question.
	//This function gets the name of the optional question
	//If the enable answer was selected, remove the disabled property from the optional question
	//and add the old numQs array to storage. The new numQs has one more question in this section than the old.
	//If the enable answer was not selected: the optional question is disabled and its answers are unselected.
	//Additionally, the numberAnswered, numQs, and questionAnswered have their values reverted.
	$(".enables").change( function (event) {
		var id = event.target.id;
		console.log(id);
		var a_pos = id.indexOf("a");	//find "a" in the id
		console.log(a_pos);
		var enabledQ = id.substring(0, a_pos) + "c";	//s#q#c for comments
		console.log(enabledQ);
		if ($(this).is(':checked')){
			$("#" + enabledQ).prop("disabled", false);
		} else {
			$("#" + enabledQ).prop("disabled", true);
		}
		/*
		var s = id[1]-1;
		//var q = Number(id[3])+1;
		var item = "numQs" + s;
		var enabledQ = id.substring(0,3); //s#q
		enabledQ += q + "a";
		console.log(id);
		console.log(enabledQ);
		console.log("JQuery");
		if (enableAns.includes(id)) {
			$('input[name=' + enabledQ +']').prop('disabled', false);
			sessionStorage.setItem(item, numQs[s]); 
			console.log("in here");
			numQs[s] += 1;
			if (numQs[s] == numberAnswered[s]){
				document.getElementsByClassName("fa-check")[s].style.visibility = "visible";
			} else {
				document.getElementsByClassName("fa-check")[s].style.visibility = "hidden";
			}
		} else {
			$('input[name=' + enabledQ +']').prop('disabled', true);
			console.log("does it make it here");
			if ($('input[name=' + enabledQ +']').is(':checked')){
				numberAnswered[s] -= 1;
				questionAnswered[s].length -= 1;
				$('input[name=' + enabledQ +']').prop('checked', false);
			}
			var qs = sessionStorage.getItem(item);
			if (qs != null){
				numQs[s] -= 1;
				sessionStorage.removeItem(item);
			}
			if (numQs[s] == numberAnswered[s]){
				document.getElementsByClassName("fa-check")[s].style.visibility = "visible";
			} else {
				document.getElementsByClassName("fa-check")[s].style.visibility = "hidden";
			}
		}
		if (!upload){
			var len = numberAnswered[s] / numQs[s] * 100;
			console.log("len: " + len);
			changeBar(s, len);
		}*/
	});
});

function getAnswersFromStorage(){
	//upload = true;
	upload = sessionStorage.getItem("uploadSuccessful");
	console.log("Value of upload: " + upload);
	totalSeconds = sessionStorage.getItem("timer");
	var x = sessionStorage.getItem("selectedAnswers");
	x = x.split(',');
	console.log(x);
	for (var i = 0; i < x.length; i++){
		//$('#' + x[i]).prop("checked", true);
		//$('#' + x[i]).prop("disabled", false);
		$('#' + x[i]).click();
		console.log("Id of this answer is: " + x[i]);	
		console.log(questionAnswered);
	}
	console.log(numberAnswered);
	console.log(numQs);
	
	var selects = ["s2q1", "s2q2"];
	selects.forEach(function(id){
		var x = sessionStorage.getItem(id);
		if (x){
			console.log(x);
			console.log(typeof(x));
			var sel = "#" + id + " option[id=" + x + "]";
			$(sel).prop("selected", "selected");
			$("#" + id).change();
		}
	});
	
	for (var i = 0; i < numSec; i++){
		changeBar(i);
	}
	
	var comments = ["s1q2c", "s1q3c", "s1q4c", "s1q5c", "s2q1c", "s6q24c", "s6q29c", "s7q1c", 
					"s7q2c", "s7q3c", "s7q4c", "s7q5c", "s1q7b1", "s1q7b2", "s1q7b3"]; 
	comments.forEach(function(id){
		//console.log(id);
		var x = sessionStorage.getItem(id)
		if (x) document.getElementById(id).value = x;
	});
	upload = false;
	//sessionStorage.clear();
}

function putAnswersInStorage(){
	$(".selection").each(function() {
		var id = $(this).children(":selected").prop("id");
		sessionStorage.setItem(this.id, id);
	});
	
	var checks = [];
	$('.A:checked').each(function() {
		//console.log(this.id);
		checks.push(this.id);
	});
	
	sessionStorage.setItem("selectedAnswers", checks);
	console.log(checks);
	var texts = $('input[type="text"], textarea').filter(function() { return $(this).val()}); 
	console.log(texts);
	texts.each(function(){
		sessionStorage.setItem(this.id, this.value);
	});
}

function results(){
	var x = sessionStorage.getItem("selectedAnswers");
	x = x.split(',');
	
}
/*
window.addEventListener('beforeunload', function (e) {
  // Chrome requires returnValue to be set
  //if (saved == true) { 
	e.returnValue = '';
  //}
 // else {
	// Cancel the event
	e.preventDefault();
 // }
  //from https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
  //does not work on safari on iOS
  	sessionStorage.clear();
});



*/