/*	
  Creates an string with the ids of every answer that is selected
  Each id is put on its own line
  Also puts the current value of the timer into the string\
  And puts the ids and contents of every non-empty textarea
  Then saves the string to a local file
*/
function saveText(){
	var time = 10043;
	var s = time + "\r\n";
	$('.A:checked').each(function() {
		//console.log(this.id);
		s += this.id + "\r\n";
	});
	//console.log(checkedArray);
	//s += ".\r\n";
	var texts = $('input[type="text"], textarea').filter(function() { return $(this).val()}); 
	console.log(texts);
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
}