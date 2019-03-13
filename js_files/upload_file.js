function uploadFile(){
	console.log("In uploadFile");
	var f = document.getElementById("file").files[0];
	var reader = new FileReader();
	var contents = [];
	reader.onload = function(progressEvent){
		//console.log(this.result);
		var lines = this.result.split('\n');
		lines = lines.filter(function(el){
			return el != "";
		});
		var checks = [];
		for (var i = 0; i < lines.length; i++){
			if (i == 0){
				sessionStorage.setItem('timer', lines[i]);
			} else if (lines[i].includes('\t')){
				var c = lines[i].split('\t');
				sessionStorage.setItem(c[0], c[1]);
			} else {
				checks.push(lines[i]);
			}
			contents.push(lines[i]);
		}
		sessionStorage.setItem('selectedAnswers', checks);
	}
	reader.readAsText(f);
	sessionStorage.setItem("uploadSuccessful", true);
	upload = true;
}