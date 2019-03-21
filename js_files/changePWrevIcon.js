$(function(){
	$('.pwToggle').click(function (){
		console.log("huh");
		togglePW($(this).prop("value"));
		$(this).find(".changeme").first().toggleClass("fa-eye-slash fa-eye");
		//console.log(okay);
	});
});
/*
$('#pwtxt').click(function() {
	$('pwToggle').toggle('fa-eye');
	console.log(huh);
	$(this).toggleClass("fa-eye fa-eye-slash");
	console.log(okay);
}*/