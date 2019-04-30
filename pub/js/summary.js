margins = {
	top: 20,
	bottom: 10,
	left: 20,
	width: 170
}

function summaryToPDF(){
	var doc = new jsPDF();
	var height = doc.internal.pageSize.getHeight();
	doc.setFontSize(20);
	doc.setFontType('bold');
	doc.setFont('Times');
	doc.text('AAC Assessment Summary', 108, 25, 'center');
	doc.setFontSize(12);
	doc.setFontType('normal');


	doc.text("Name of Patient: ____________________________", margins.left, 40);
	doc.text("Date: ________________", margins.left, 47);
	doc.fromHTML($('#ans').get(0), margins.left, 47, {
		'width': margins.width }, 
		function(dispose) {footer(doc, doc.internal.getNumberOfPages());},
		margins);
	doc.save("summary.pdf");
}

function footer(doc, pages){
	for (var i = 1; i <= pages; i++){
		var pageNum = "Page " + i + " of " + pages;
		doc.setPage(i);
		doc.setFontSize(10);
		doc.setTextColor(128,128,128);
		doc.text(pageNum, margins.width + margins.left - 10, doc.internal.pageSize.height - 10);
	}	
}	

//removes all answers that weren't selected on the assessment page
//also removes comment questions that weren't answered.
function getAnswerVals(){
    var x = sessionStorage.getItem("selectedAnswers");
    if (!x) {
        document.getElementById("summaryError").style.display = "block";
        return;
    }
	x = x.split(',');


	var ids = $.map( x, function(i) { return document.getElementById(i) } );	//jquery array with the elements each id references

	var ids = $(ids);
	var $answers = $(".answers");
	var $ans_children = $answers.children().not(".ignore");
	$ans_children.not(ids).each(function(){
		$(this).remove();	//removes answers that weren't selected
	});
	//$ans_children.not(":only-child").each(function(){	

		//$(this).text($(this).text() + ", ");	//puts a comma between answers

		//if $(this).hasClass()
		//$(this).css("display", "block");	//puts a comma between answers
		//$(this).css("margin-left", "75%");	//puts a comma between answers
	//});
	
	var comments = ["s1q2c", "s1q3c", "s1q4c", "s1q5c", "s1q7b1", "s1q7b2", "s1q7b3",
					"s2q1c", "s2q48c", "s6q23c", "s6q24c", "s6q25c", "s6q26c", "s6q27c", 
                    "s6q28c", "s6q29c", "s6q30c", "s7q1c", "s7q2c", "s7q3c", "s7q4c", "s7q5c", "s7q6c"]; 
	comments.forEach(function(id){
		var x = sessionStorage.getItem(id);

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

		$(this).remove();	//removes unanswerd questions
	});*/
}
