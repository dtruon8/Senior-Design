var upload = false;
var firstline;
$(function() {
	$("#file").change(function (){
		var f = document.getElementById("file").files[0];
		var ext = this.value.split(".").pop().toLowerCase();	//get the file extension
		console.log(ext);
		if (ext !== "txt"){
			$("#fileError").css("display", "block");
			this.value = null;
			upload = false;
		} else {
			var reader = new FileReader();
			reader.onload = function(event){
				firstline = this.result.split('\n')[0].trim();
				console.log(firstline);
				if (firstline == "from AAC diagnostic tool"){
					console.log("in if part");
					$("#fileError").css("display", "none");
					upload = true;
					uploadFile();
				} else {
					$("#fileError").css("display", "block");
					console.log("in else");
				}
			}
			reader.readAsText(f);			
		}
	});
});

window.onbeforeunload = function(){
	$("#file").val('');
}

function uploadFile(){
	if (upload) { 
		console.log("In uploadFile");
		var f = document.getElementById("file").files[0];
		var reader = new FileReader();
		var contents = [];
		reader.onload = function(event){
			//console.log(this.result);
			var lines = this.result.split('\n').splice(1);
			console.log(lines);
			lines = lines.filter(function(el){
				return el != "";
			});
			var checks = [];
			//for (var i = 0; i < lines.length; i++){
			lines.forEach(function(line){
				var c = line.split('\t');
				if (c[0] == "timer"){
					sessionStorage.setItem('timer', c[1]);
				} else if (c[0] == "selection"){
					sessionStorage.setItem(c[1], c[2]);
				} else if (c.length == 1){
					checks.push(line);
				} else {
					sessionStorage.setItem(c[0], c[1]);
				}
				//contents.push(lines[i]);
			});
			sessionStorage.setItem('selectedAnswers', checks);
		}
		reader.readAsText(f);
		sessionStorage.setItem("uploadSuccessful", true);
	}
}