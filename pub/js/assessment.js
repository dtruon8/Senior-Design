//Global variables
var currentLen = [];	//tracks the current width of each progress bar
var numQs = [];			//the number of questions in each section
var originalNumQs = [];			//the original number of questions in each section since numQs might change
var done = false;		//true when every (required) answer has been answered. false otherwise
var saved = false;		//keeps track of whether assessment progress has been saved. unimplemented currently
var started = false;	//tracks whether the user has answered a question. used to display warning
var questionAnswered = [];	//keeps track of whether each question is answered.
var numberAnswered = [];	//the number of questions in a section that have been answered. used in deternining progbar len
var numSec;				//the number of (non-comment) sections in the assessment. 
						//used for determining the length of numQs and questionAnswered
						
var upload = false;		//true when a file was uploaded on the home page
var enableCom = ["s1q2a1", "s1q3a1", "s1q4a1", "s1q5a1", "s2q48a1"];	//used for enabling comment questions depending on the answer selected
var enableQs = {
	s6q6a1: ["s6q7a"],
	s6q8a1: ["s6q9a", "s6q10a"]
};	//for enabling multple choice answers. key is the id of the enable answer and value(s) are the names of answers to enable
var enableQAnswered = {
	s6q6a1: false,
	s6q7a1: false,
};	//determines whether an enable answer is currently selected. used as a condition for changing numQs
var timerVar;


/*
	Run on page load.
	Determines the number of sections
	Initializes the width of all progress bars to 0
	Counts the number of questions in each section
	Initializes questionAnswered to false for every question
	
*/
function initialize(){
	timerVar = setInterval(countTimer, 1000);

	$("input[type=radio], input[type=checkbox]").prop("checked",false);
	numSec =  document.getElementsByClassName("pbar").length;

	numQs.length = numSec;
	var bars = document.getElementsByClassName("bar");
	for (var i = 0; i < numSec; i++){
		currentLen[i] = 0;
		var secNum = "s" + (i+1);	//s1 when i=0, s2 when i=1, etc.
		var section = document.getElementById(secNum);
		var secNumQ = section.getElementsByClassName("Qn").length; //number of questions in section secNum
		var commentNum = section.getElementsByClassName("comment").length; //number of comment questions
		var tableNum = section.getElementsByTagName("table").length; //number of tables
		secNumQ -= commentNum;	//don't count comment questions in the number of questions
		secNumQ -= tableNum;	//table rows have the Qn class so don't count the Qn in the <p> tag before the table
		var tempArray = [];
		tempArray.length = secNumQ;	//sets the length of the tempArray to the number of questions in this section
		tempArray.fill(false, 0, secNumQ); 
		questionAnswered.push(tempArray);	//includes optional (must be enabled) questions 
		var optionalNum = section.getElementsByClassName("optional").length;	
		secNumQ -= optionalNum; //don't count optional questions to the total until they are enabled
		numQs[i] = secNumQ;
		numberAnswered[i] = 0;
	}

	originalNumQs = numQs.slice();	//originalNumQs is a copy of numQs

	document.getElementById("defaultOpen").click();		//open section 1
	var y = sessionStorage.getItem("uploadSuccessful");	//determine if a file was uploaded

    if (y) {
        upload = true;
        stopTimer();
		getAnswersFromStorage();
		var numAnsZero = numberAnswered.filter(val => val > 0);	//numAnsZero contains the nonzero elements of numberAnswered
		//some browsers don't update the progress tracking. this fixes that.
		if (numAnsZero.length == 0){
			var sel = $(".A:checked, .selection option:selected, .selectionAlt option:selected");	//select all answered questions
			sel.each(function(){
				var id = this.id;
				if (id){
					var s = id[1] - 1 ;
					var a_pos = id.indexOf("a");	//find "a" in the id
					var q = Number(id.substring(3, a_pos)) - 1; //question index
					console.log(s, q);
					if (!questionAnswered[s][q]){
						numberAnswered[s] += 1;
						questionAnswered[s][q] = true;
					}
					var elem = document.getElementById(id);
					if (elem.classList.contains("commentEnable")){
						enableCSelected(id);
					} else if (elem.classList.contains("questionEnable")){
						enableQSelected(id);
					}
				}
			});
			var texts = $(".required-text").filter(function() { return $(this).val()});
			texts.each(function(){
				var id = this.id;
				var s = id[1]-1;
				var c_pos = id.indexOf("c");
				var q = Number(id.substring(3, c_pos)) - 1;
				if (!questionAnswered[s][q]){
					numberAnswered[s] += 1;
					questionAnswered[s][q] = true;
				}
			});
			for (var i = 0; i < numSec; i++){
				changeBar(i);
			}
		}
	}
}

/*
	Updates the width of the progress bars and determines if the section is complete
*/
function changeBar(section, fromOpenContents){
	saved = false;	//the previously saved file is no longer up to date
	var len = numberAnswered[section] / numQs[section] * 100;
	if (len > 100) len = 100;	//cap length at 100%
	var curLen = currentLen[section];	//the previous length of the bar
	section += 1;
	var bar = document.getElementById("progbar" + section);	//progbar# 
	var barTxt = document.getElementById("barText" + section);
	if (curLen != len){
		changeMeter(bar, curLen, len, barTxt);
    }
    var checkmark = document.getElementsByClassName("fa-check")[section-1];
    if (len === 100) {
        checkmark.style.visibility = "visible";
    } else {
        checkmark.style.visibility = "hidden";
    }
    checkCompletion();
    currentLen[section - 1] = len;
    if (bar.style.width != len && fromOpenContents) {
        bar.style.width = ~~len + "%";
        barTxt.innerHTML = ~~len + "%"
    }
}

/*
	Animates the increase or decrease of the progress bar
*/
function changeMeter(bar, start, stop, barTxt){
	var x = start < stop ? 1 : -1;	//if stop > start, increase the bar; otherwise descrease it
	var width = start;
	var id = setInterval(frame, 12);	//12ms animation
	function frame() {
		if (width === ~~stop) {
			clearInterval(id);
		} else {
			width += x;

			if ((width > stop && x > 0) || (width < stop && x < 0)) width = ~~stop; //ensures the percentage stays within bounds
			bar.style.width = width + '%'; 
			if (barTxt) barTxt.innerHTML = ~~width + '%';
		}
	}
}


/*
	Called when a question (radio, checkbox, or selection) is answered
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

	var qidx = Number(id.substring(3, a_pos)) - 1; //question index
	//var qidx = id[3]-1; //question index
	var aidx = Number(id.substring(a_pos+1)) - 1; //answer number	
	var elem = document.getElementById(id);

	if (!questionAnswered[sidx][qidx]){
		questionAnswered[sidx][qidx] = true;
		numberAnswered[sidx]++;
		if(!upload){
			changeBar(sidx);
		}
	}
	else if (questionAnswered[sidx][qidx] && elem.type == "checkbox"){
		var othersChecked = [];
		var othersNames = [];
		var namepos = id.indexOf("a");

		var name = id.substring(0, namepos + 1);

		//iterate through the other elements with the same name. put their boolean value into othersChecked
		//afterwards, set the value of othersChecked to either true or false
		$("input[name=" + name + "]").not("#" + id).each( function(){
			othersChecked.push((this.checked) ? true : false);
		});
		othersChecked = othersChecked.includes(true) ? true : false;

		if (!othersChecked){
			numberAnswered[sidx]--;
			if (done)
				done = false;
			questionAnswered[sidx][qidx] = false;
			changeBar(sidx);
		}
	}
}

var arraySum = function(arr) {
	return arr.reduce(function(acc, cur) {return acc + cur;}, 0);
}

/*
	Determines whether the assessment is complete (all non-optional questions have been answered)
*/
function checkCompletion(){
	var totalAns = arraySum(numberAnswered);
	var totalQ = arraySum(numQs);
	done = totalQ === totalAns;
	var submit = $(".submit_button");
	if (done){
		submit.removeClass("submit-disabled");
		submit.find("a").prop("href", "results.html");
		stopTimer();
		if (!upload){
			//sessionStorage.setItem("time", totalSeconds);
		}
	} else {
		submit.addClass("submit-disabled");
		submit.prop("href", "javascript:;");
		if(!upload){
			//sessionStorage.removeItem("time");
		}
	}
}
function press(){
	$("#s4q2").val($("#s4q1").val());
	checkCompletion();
}

//display a warning message if the user has unsaved work and is not done
function closing(){
	if (started && !saved && !done)
		return 'warning';
	else return null;
}

function validateNum(event){
	var keycode = event.keyCode;

	switch (true){
		case keycode == 45:	//"-"
		case keycode == 46:	//"."
			return true;
		case keycode < 48:	//"0"
		case keycode > 57:	//"9"
			return false;
		default:
			return true;
	}
}

//Jquery
$(function(){
    window.onbeforeunload = closing;
	
	$("td label").click(function(e){
		e.stopPropagation()	//prevent label from triggering click event
	});

	$("td").click(function (){
		var x = $(this).find("input").first();
		var input = document.getElementById(x.prop("id"));
		if (input){
			input.focus();
			input.click();
		}
	});
	
	$(".selection, .selectionAlt").change(function() {
		var id = $(this).children(":selected").prop("id");

		var  sidx = id[1]-1;	//section number
		var a_pos = id.indexOf("a");	//find "a" in the id
		var qidx = Number(id.substring(3, a_pos)) - 1;	//question index
		answerSelected(id);
		checkCompletion();
	});
	
	//for textarea and text inputs, check if it is answered when the user leaves the text box
	//the question is considered answered if the text box is not empty
	$(".required-text").blur(function(){

		var id = this.id;
		var sidx = id[1]-1;
		var c_pos = id.indexOf("c");
		var qidx = Number(id.substring(3, c_pos)) - 1;

		if($.trim(this.value).length){

			if (!questionAnswered[sidx][qidx]){
				numberAnswered[sidx] += 1;
				questionAnswered[sidx][qidx] = true;
			}
		} else {

			if (questionAnswered[sidx][qidx]){
				questionAnswered[sidx][qidx] = false;
				numberAnswered[sidx] -= 1;
			}
		}
        changeBar(sidx);
        checkCompletion();
	});
	
	$(".A").click( function(event) {
		if (!started) {
			started = true;
		}
		var id = event.target.id;

		var  sidx = id[1]-1;	//section number
		var a_pos = id.indexOf("a");	//find "a" in the id
		var qidx = Number(id.substring(3, a_pos)) - 1;	//question index


		
		//currently unused
		//limits the number of answers that can be selected by checkbox questions 
		//add the limit-input class to all answers to the question
		/*if ($(this).hasClass("limit-input")){
			var name = $(this).prop("name");
			var limit = 3;	//can change to whatever limit is needed or make it vary per question
			if ($("input[name=" + name + "]:checked").length > limit){
				this.checked = false;
			}
		}*/
		
		//currently unused
		//if two questions have the same answers choices,
		//prevent the user from selecting the same answer to both questions
		/*if ($(this).hasClass("sameAns")){
			var v = event.target.value;

			$(".sameAns:checked").not(this).each(function(){
				if (this.value === v){
					$(this).prop('checked',false);

					var stopChecked = this.id;

					var s = stopChecked[1]-1;
					var q = stopChecked[3]-1;
					questionAnswered[s][q] = false;
					numberAnswered[s] -= 1;
				}
			});
			changeBar(id[1]-1);
		}*/
		
		//enable or disable comment questions depending on answer selected
		if ($(this).hasClass("commentEnable")) {
			enableCSelected(id);
		}	
		
		//enable or disable other input types
		if($(this).hasClass("questionEnable")){
			enableQSelected(id);
		}
		answerSelected(id);
		checkCompletion();
	});
});

function enableCSelected(id){
	var a_pos = id.indexOf("a");	//find "a" in the id
	var enabledQ = id.substring(0, a_pos) + "c";	//id is s#q#c for optional comments	
	if (enableCom.includes(id)){
		$("#" + enabledQ).prop("disabled", false);
	} else {
		$("#" + enabledQ).prop("disabled", true);
	}
}

function enableQSelected(id){
	var s = id[1] - 1;	//section number
	//if the answer is an enable answer, enable all of its associated questions
	//and add the number of questions enabled to numQs[s]
	if(enableQs.hasOwnProperty(id)){
		numQs[s] += enableQs[id].length;
		enableQAnswered[id] = true;
		enableQs[id].forEach(function(q){
			$('input[name=' + q + ']').prop('disabled', false);
		});
	} else {
		//if the selected answer wasn't the enable ans, get the id of the enable ans.
		//then adjust numQs[s], disable the questions, and if they were selected, deselect them,
		//and adjust numberAnswered and questionAnswered
		var otherAns = id.substr(0, id.length - 1) + "1";

		if (enableQs.hasOwnProperty(otherAns)){
			
			if (enableQAnswered[otherAns]){
				numQs[s] -= enableQs[otherAns].length;
				enableQAnswered[otherAns] = false;
			}
			enableQs[otherAns].forEach(function(q){

				$('input[name=' + q + ']').prop('disabled', true);
				$('input[name=' + q + ']').prop('checked', false);
				var a_pos = q.indexOf("a");
				var qNum = Number(q.substring(3, a_pos)) - 1; 

				if (questionAnswered[s][qNum]){
					questionAnswered[s][qNum] = false;
					numberAnswered[s] -= 1;
				}
			});
		}
	}
	changeBar(s);
}

//on page load, get the uploaded answers
function getAnswersFromStorage(){
    totalSeconds = sessionStorage.getItem("timer");
    resumeTimer();
    var x = sessionStorage.getItem("selectedAnswers");
    x = x.split(',');
    x = x.filter(function (el) {
        return el.trim();
    });

    for (var i = 0; i < x.length; i++) {
		var input = $("#" + x[i]);
		if (input.prop("disabled")){
			input.prop("disabled", false);
		}
		input.click();
	}


	
	var selects = ["s2q1", "s2q51c", "s6q11c", "s6q12c", "s6q13c", "s6q14c", "s6q15c", "s6q16c", "s6q20c", "s6q21c"]; //drop-down questions
	selects.forEach(function(id){
		var x = sessionStorage.getItem(id);
		if (x){
			var sel = "#" + id + " option[id=" + x + "]";
			$(sel).prop("selected", "selected");
			$("#" + id).change();
		}
	});


    for (var i = 0; i < numSec; i++) {
        changeBar(i);
    }


	var comments = ["s1q2c", "s1q3c", "s1q4c", "s1q5c", "s1q7b1", "s1q7b2", "s1q7b3",
					"s2q1c", "s2q48c", "s6q23c", "s6q24c", "s6q25c", "s6q26c", "s6q27c", 
                    "s6q28c", "s6q29c", "s6q30c", "s7q1c", "s7q2c", "s7q3c", "s7q4c", "s7q5c", "s7q6c"]; 
	comments.forEach(function(id){
		var x = sessionStorage.getItem(id)
        if (x) {
            var text = document.getElementById(id);
            text.value = x;
            $("#" + id).blur();
        }
    });

	checkCompletion();
	upload = false;
	sessionStorage.clear();
}

//put the selected ids and comment text in sessionStorage for use on the results page
function putAnswersInStorage(){
	var checks = [];
	$('.A:checked').each(function() {

		checks.push(this.id);
	});
	
	$(".selection, .selectionAlt").each(function() {
		var id = $(this).children(":selected").prop("id");
		checks.push(id);
	});
	
	sessionStorage.setItem("selectedAnswers", checks);

	var texts = $('input[type="text"], textarea').filter(function() { return $(this).val()}); 

	texts.each(function(){
		sessionStorage.setItem(this.id, this.value);
	});
}

/*	
  Creates an string with the ids of every answer that is selected
  Each id is put on its own line
  Also puts the current value of the timer into the string
  And puts the ids and contents of every non-empty text input
  Then saves the string to a local file
*/
function saveFile(){
	var time = totalSeconds;
	var s = "from AAC diagnostic tool" + "\r\n";
	s += "timer\t" + time + "\r\n";
	$('.A:checked').each(function() {

		s += this.id + "\r\n";
	});

    var selects = $(".selection, .selectionAlt");
    selects.each(function() {

		var id = $(this).children(":selected").prop("id");
		if (id)
		s += "selection" + "\t" + $(this).prop("id") + "\t" + id + "\r\n";
    });

	var texts = $('input[type="text"], textarea').filter(function() { return $(this).val()}); 

	texts.each(function(){
		s += this.id + "\t" + this.value + "\r\n"
	});

	var blob = new Blob([s], { type: "text/plain;charset=utf-8" });
	var url = URL.createObjectURL(blob);
	var dl = document.getElementById("saveBtn");
	dl.href = url;
	dl.download = "savefile.txt";
	dl.click();
	dl.href ="javascript:;";
	dl.download = ".";
	saved = true;
}

//Creation of tabs with content inside them
function openSection(evt, sectionName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	for ( i = 1; i <= tabcontent.length; i++){

		var s = "s" + i;
		if (s != sectionName){
			document.getElementById(s).style.display = "none";
		}
    }
    if (sectionName != "s7") {      //s7 is the comment section, which doesn't have a progress bar
        changeBar(sectionName[1] - 1, true);  //ensures progress bar displays correct value
    }
    document.getElementById(sectionName).style.display = "block";
	evt.currentTarget.className += " active";
}

//Timer function with resume and pause button
//var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;
var checkTimer = true;
function countTimer() {
    ++totalSeconds;
	var hour = Math.floor(totalSeconds /3600);
	var minute = Math.floor((totalSeconds - hour*3600)/60);
	var seconds = totalSeconds - (hour*3600 + minute*60);

	hour = hour.toString().padStart(2, "0");
	minute = minute.toString().padStart(2, "0");
	seconds = seconds.toString().padStart(2, "0");
	document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}
function stopTimer() {
	checkTimer = false;
	clearInterval(timerVar);
}
function resumeTimer() {
	if (checkTimer == false) {
		checkTimer = true;
		timerVar = setInterval(countTimer, 1000);
	}
}