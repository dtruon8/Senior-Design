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