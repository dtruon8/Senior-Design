var complexity;
var len = false;
var meterLen = 0;
var noMatch = false;
var scoreValue = {0: 0, 1: 25, 2: 50, 3: 75, 4: 100};
function pwCheck() {
	var val = document.getElementById("pwtxt").value;
	
	len = val.length >= 10;	//is the pw at least 10 characters?
	var dig = /\d/.test(val);	//contains digit?
	var low = /[a-z]/.test(val);	//contains lowercase letter?
	var up = /[A-Z]/.test(val);	//contains uppercase letter?
	var spec = /[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(val); //contains special character?
	complexity = dig + low + up + spec; //OWASP recommends at least 3 of these be met
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
function checkPasswordMatch() {
	var pw = document.getElementById("pwtxt");
	var conf = document.getElementById("confirmPw");
	if(pw.value != conf.value) {
		conf.setCustomValidity("Passwords must match");
		noMatch = true;
	} else {
		conf.setCustomValidity("");
		console.log("Password successfully entered");
	}

}

function confirmPass(){
	console.log("In confirmPass");
	if (!noMatch){
		console.log("Returning");
		return;
	} else {
		var pw = document.getElementById("pwtxt");
		var conf = document.getElementById("confirmPw");
		console.log(pw.value);
		console.log(conf.value);
		if(pw.value != conf.value) {
			console.log("no match");
			conf.setCustomValidity("Passwords Don't Match");
			conf.reportValidity();
		} else {
			conf.setCustomValidity("");
			console.log("Password successfully entered");
		}
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
