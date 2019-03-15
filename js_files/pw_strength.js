var complexity;
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

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}