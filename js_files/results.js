margins = {
	top: 20,
	bottom: 10,
	left: 20,
	width: 160
}

function resultsToPDF(){
	var doc = new jsPDF();
	var height = doc.internal.pageSize.getHeight();
	doc.setFontSize(20);
	doc.setFontType('bold');
	doc.setFont('Times');
	doc.text('AAC Assessment Summary', 108, 25, 'center');
	doc.setFontType('normal');
	//doc.fromHTML($('#ans').get(0), 15, 30, {
	//'width': 170 });
	doc.fromHTML($('#ans').get(0), margins.left, 30, {
		'width': margins.width }, 
		function(dispose) {footer(doc, doc.internal.getNumberOfPages());},
		margins);
	doc.save("sample.pdf");
}

function footer(doc, pages){
	for (var i = 1; i <= pages; i++){
		var pageNum = "Page " + i + " of " + pages;
		doc.setPage(i);
		doc.setFontSize(10);
		doc.text(pageNum, margins.width + margins.left, doc.internal.pageSize.height - 10);
	}	
}	

//removes all answers that weren't selected on the assessment page
//also removes comment questions that weren't answered.
function getAnswerVals(){
	var x = sessionStorage.getItem("selectedAnswers");
	x = x.split(',');
	
	/*$(".answers").children().each(function(){
		console.log(this.id);
		if (!x.includes(this.id))
			$(this).remove();
	});*/
	var ids = $.map( x, function(i) { return document.getElementById(i) } );
	console.log(ids);
	var ids = $(ids);
	var $answers = $(".answers");
	var $ans_children = $answers.children();
	$ans_children.not(ids).each(function(){
		$(this).remove();	//removes answers that weren't selected
	});
	$ans_children.not(":last-child").each(function(){	
		console.log(this.id);
		$(this).text($(this).text() + ", ");	//puts a comma between answers
	});
	
	var comments = ["s1q2c", "s1q3c", "s1q4c", "s1q5c", "s1q7b1", "s1q7b2", "s1q7b3", "s2q1c",
					"s6q24c", "s6q29c", "s7q1c", "s7q2c", "s7q3c", "s7q4c", "s7q5c"]; 
	comments.forEach(function(id){
		var x = sessionStorage.getItem(id);
		console.log(x);
		if (x){
			//$("#" + id).text($(this).text() + x);	//adds the comment text
			$("#" + id).text(x);	//adds the comment text
		}
	});
	$(".optional").each(function(){
		if ($(this).next().text() == ""){
			//remove unanswered questions
			$(this).next().remove();
			$(this).remove();	
		}
	});
	//$(".answers:not(:has(*))").each(function(){
	/*$answers.not(":has(*)").each(function(){
		//console.log(this.id);
		$(this).remove();	//removes unanswerd questions
	});*/
}
