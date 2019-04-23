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
var enableCom = ["s1q2a1", "s1q3a1", "s1q4a1", "s1q5a1", "s2q48a1"];	//used for enabling comment questions depending on the answer selected
var enableQs = {
		s6q6a1: ["s6q7a"],
		s6q8a1: ["s6q9a", "s6q10a"]
};	//for enabling multple choice answers. key is the id of the enable answer and value(s) are the names of answers to enable
var timerVar;	


/*
Function initialze() is run  on page load. 
Adds onclick="answerSelected(this.id)" to all answers
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
		//set the width of the progress bars,
		//set the current length of all the progress bars as 0,
		//set the number of questions in each section,
		//and fill the questionsAnswered array with false
		currentLen[i] = 0;
		//bars[i].style.width = (width) + "px";
		var secNum = "s" + (i+1);	//s1 when i=0, s2 when i=1, etc.

		var section = document.getElementById(secNum);

		var secNumQ = section.getElementsByClassName("Qn").length; //number of questions in section secNum

		var commentNum = section.getElementsByClassName("comment").length;
		var tableNum = section.getElementsByTagName("table").length;



		secNumQ -= commentNum;	//don't count comment questions in the number of questions
		secNumQ -= tableNum;
		var tempArray = [];
		tempArray.length = secNumQ;	//sets the length of the tempArray to the number of questions in this section
		tempArray.fill(false, 0, secNumQ); 
		var optionalNum = section.getElementsByClassName("optional").length;

		secNumQ -= optionalNum; //don't count optional questions to the total until they are enabled
		numQs[i] = secNumQ;
		numberAnswered[i] = 0;
		questionAnswered.push(tempArray);	//equivalent to questionAnswered[i] = tempArray;
	}




	originalNumQs = numQs.slice();	//originalNumQs is a copy of numQs

	document.getElementById("defaultOpen").click();
	var y = sessionStorage.getItem("uploadSuccessful");

    if (y) {
        upload = true;
        stopTimer();
		getAnswersFromStorage();
		var numAnsZero = numberAnswered.filter(val => val > 0);	//some browsers don't update the progress for some reason. this fixes that.
		if (numAnsZero.length == 0){
			var sel = $(".A:checked, .selection option:selected, .selectionAlt option:selected");
			sel.each(function(){
				console.log(this.id);
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
Checks whether the bar width should be increased or decreased. 
Calls the appropriate function and then changes currentLen
*/
function changeBar(section, fromOpenContents){
	saved = false;
	var len = numberAnswered[section] / numQs[section] * 100;
	if (len > 100) len = 100;

	var curLen = currentLen[section];
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
function changeMeter(bar, start, stop, barTxt){
	var x = start < stop ? 1 : -1;

	var width = start;


	var id = setInterval(frame, 12);
	function frame() {
		if (width === ~~stop) {
			clearInterval(id);
		} else {
			width += x;

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

	var qidx = Number(id.substring(3, a_pos)) - 1; //question index
	//var qidx = id[3]-1; //question index
	var aidx = Number(id.substring(a_pos+1)) - 1; //answer number


	
	var elem = document.getElementById(id);

	if (!questionAnswered[sidx][qidx]){
		questionAnswered[sidx][qidx] = true;
		numberAnswered[sidx]++;



		//var len = currentLen[sidx] + 100 / numQs[sidx];
		if(!upload){
			//var len = numberAnswered[sidx] / numQs[sidx] * 100;
			//if (len > 100) len = 100;	//caps the length at 100
			changeBar(sidx);
		}		
		if (numQs[sidx] == numberAnswered[sidx]){
				document.getElementsByClassName("fa-check")[sidx].style.visibility = "visible";
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
			//var len = currentLen[sidx] - 100 / numQs[sidx];
			//var len = numberAnswered[sidx] / numQs[sidx] * 100;

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
var arraySum = function(arr) {
	return arr.reduce(function(acc, cur) {return acc + cur;}, 0);
}
//checks whether the number of questions that have been answered is equal to the number of 
function checkCompletion(){
	var totalAns = arraySum(numberAnswered);

	var totalQ = arraySum(numQs);

	done = totalQ === totalAns;
	var submit = $(".submit_button");
	if (done){
		submit.removeClass("submit-disabled");
		submit.find("a").prop("href", "results.html");
		if (!upload){
			sessionStorage.setItem("time", totalSeconds);
			//stopTimer();
		}
	} else {
		submit.addClass("submit-disabled");
		submit.prop("href", "javascript:;");
		//resumeTimer();
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

			var a_pos = id.indexOf("a");	//find "a" in the id

			var enabledQ = id.substring(0, a_pos) + "c";	//id is s#q#c for optional comments


			
			if (enableCom.includes(this.id)){
				$("#" + enabledQ).prop("disabled", false);
			} else {
				$("#" + enabledQ).prop("disabled", true);
			}
			
		}	
		
		//enable or disable other input types
		if($(this).hasClass("questionEnable")){

			var s = id[1] - 1;	//section number
			//if the answer is an enable answer, enable all of its associated questions
			//and add the number of questions enabled to numQs[s]
			if(enableQs.hasOwnProperty(id)){


				numQs[s] += enableQs[id].length;
				enableQs[id].forEach(function(q){
					$('input[name=' + q + ']').prop('disabled', false);
				});
			} else {
				//if the selected answer wasn't the enable ans, get the id of the enable ans.
				//then adjust numQs[s], disable the questions, and if they were selected, deselect them,
				//and adjust numberAnswered and questionAnswered
				var otherAns = id.substr(0, id.length - 1) + "1";

				if (enableQs.hasOwnProperty(otherAns)){
					if (numQs[s] > originalNumQs[s]){
						numQs[s] -= enableQs[otherAns].length;
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
		answerSelected(id);
		checkCompletion();
	});
});

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
        $("#" + x[i]).click();
        console.log(x[i]);
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