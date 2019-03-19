/*var complexity;
var len;
function pwCheck() {
	var val = document.getElementById("pwtxt").value;
	
	len = val.length >= 10;	//is the pw at least 10 characters?
	var dig = /\d/.test(val);	//contains digit?
	var low = /[a-z]/.test(val);	//contains lowercase letter?
	var up = /[A-Z]/.test(val);	//contains uppercase letter?
	var spec = /[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(val); //contains special character?
	complexity = dig + low + up + spec; //OWASP recommends at least 3 of these be met
	//console.log("Compelxity: " + complexity);
	var requirementsMet = len && complexity >= 3;
	if (requirementsMet) {
		//console.log("Password meets requirements");
		var s = "Requirements Met";
	} else {
		var s = "Requirements Not Met"; 
	}
	document.getElementById("req").innerHTML = s;
	
	//change the colors of the requirements if they are met:
	document.getElementById("pwLen").style.color = len ? "green" : "red";
	document.getElementById("pwLow").style.color = low ? "green" : "red";
	document.getElementById("pwUp").style.color = up ? "green" : "red";
	document.getElementById("pwNum").style.color = dig ? "green" : "red";
	document.getElementById("pwSpe").style.color = spec ? "green" : "red";
	
}
function checkInfo() {
	var msg = "";
	var pw = document.getElementById("pwtxt").value;
	var conf = document.getElementById("confirmPw").value;
	console.log(pw);
	console.log(conf);
	console.log(len);
	if (pw == "") {
		msg = "Please enter a password";
	} else if (len == false) {
		msg = "Password must be at least 10 characters";
	} else if (complexity < 3) {
		msg = "Password doesn't meet requirements";
	} else if (pw != conf){
		msg = "Passwords don't match";
	}
	
	if (msg != ""){
		alert(msg);
		return false;
	} else {
		document.getElementById("req").innerHTML = "Password successfully entered.";
		return true;
	}
	
}

function togglePW(id) {
	var pw = document.getElementById(id);
	if (pw.type === "password") {
		pw.type = "text";
	} else {
		pw.type = "password";
	}
}
*/


var complexity;
var len;
var meterLen = 0;
var scoreValue = {0: 0, 1: 25, 2: 50, 3: 75, 4: 100};
function pwCheck() {
	var val = document.getElementById("pwtxt").value;
	
	len = val.length >= 10;	//is the pw at least 10 characters?
	var dig = /\d/.test(val);	//contains digit?
	var low = /[a-z]/.test(val);	//contains lowercase letter?
	var up = /[A-Z]/.test(val);	//contains uppercase letter?
	var spec = /[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(val); //contains special character?
	complexity = dig + low + up + spec; //OWASP recommends at least 3 of these be met
	//console.log("Compelxity: " + complexity);
	var requirementsMet = len && complexity >= 3;
	if (requirementsMet) {
		//console.log("Password meets requirements");
		var s = "Requirements Met";
	} else {
		var s = "Requirements Not Met"; 
	}
	var result = zxcvbn(val);
	console.log("Score: " + result.score);
	console.log(result.sequence);
	document.getElementById("req").innerHTML = s;
	
	//change the colors of the requirements if they are met:
	document.getElementById("pwLen").style.color = len ? "green" : "red";
	document.getElementById("pwLow").style.color = low ? "green" : "red";
	document.getElementById("pwUp").style.color = up ? "green" : "red";
	document.getElementById("pwNum").style.color = dig ? "green" : "red";
	document.getElementById("pwSpe").style.color = spec ? "green" : "red";
	
	return scoreValue[result.score];
}
function checkInfo() {
	var msg = "";
	var pw = document.getElementById("pwtxt").value;
	var conf = document.getElementById("confirmPw").value;
	console.log(pw);
	console.log(conf);
	console.log(len);
	if (pw == "") {
		msg = "Please enter a password";
	} else if (len == false) {
		msg = "Password must be at least 10 characters";
	} else if (complexity < 3) {
		msg = "Password doesn't meet requirements";
	} else if (pw != conf){
		msg = "Passwords don't match";
		//gives an error that the PWs don't match even though they are
	}
	
	if (msg != ""){
		alert(msg);
		return false;
	} else {
		document.getElementById("req").innerHTML = "Password successfully entered.";
		return true;
	}
	
}
function togglePW(id) {
	var pw = document.getElementById(id);
	if (pw.type === "password") {
		pw.type = "text";
	} else {
		pw.type = "password";
	}
}

function changeMeter(bar, start, stop, barTxt){
	var x = start < stop ? 1 : -1;
	console.log("In change meter");
	var width = start;
	console.log("Starting width: " + start);
	console.log("Stopping width: " + stop);
	var id = setInterval(frame, 12);
	function frame() {
		if (width === stop) {
			clearInterval(id);
		} else {
			width += x;
			//console.log(width);
			if ((width > stop && x > 0) || (width < stop && x < 0)) width = stop; //to ensure the percentage stays within bounds
			bar.style.width = width + '%'; 
			if (barTxt) barTxt.innerHTML = ~~width + '%';
		}
	}
}
$(function() {
    $("#pwtxt").on("input", function () {
        var x = pwCheck();
		//console.log("X: " + x);
		//console.log("meterLen: " + meterLen);
		if (x != meterLen){
			var barColor;
			switch (true){
				case x < 34 :
					barColor = "red";
					break;
				case x < 67:
					barColor = "yellow";
					break;
				default:
					barColor = "green";
			}
			console.log(barColor);
			$("#pwmeter").animate({
				width: x + "%",	
				backgroundColor: barColor,
			}, 300);
		}
		meterLen = x;
	});
});
