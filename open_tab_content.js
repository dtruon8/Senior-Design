//Creation of tabs with content inside them
function openSection(evt, sectionName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  for ( i = 1; i <= 7; i++){
	var s = "s" + i;
	if (s != sectionName){
		document.getElementById(s).style.display = "none";
	}
  }
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}


//Timer function with resume and pause button
var timerVar = setInterval(countTimer, 1000);
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

