//Creation of tabs with content inside them
function openSection(evt, sectionName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  for ( i = 1; i <= 6; i++){
	var s = "s" + i;
	if (s != sectionName){
		document.getElementById(s).style.display = "none";
	}
  }
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}