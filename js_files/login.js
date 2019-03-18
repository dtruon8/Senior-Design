var login_attempts = 3;
function check_form()
{
 var email = document.getElementById("email").value;
 var pw = document.getElementById("myInput").value;
 if(email == "talkerscode" && pw == "talkerscode")
	 //verify registered user
	 //will use this feature when backend is created
	 //http://talkerscode.com/webtricks/login-form-with-limited-login-attempts-using-javascript-and-html.php
 {
  alert("SuccessFully Logged In");
  document.getElementById("email").value = "";
  document.getElementById("myInput").value = "";
 }
 else
 {
  if(login_attempts == 0)
  {
   alert("No Login Attempts Available");
  }
  else
  {
   login_attempts = login_attempts - 1;
   alert("Login Failed Now Only " + login_attempts + " Login Attempts Available");
   if(login_attempts == 0)
   {
    document.getElementById("email").disabled=true;
    document.getElementById("myInput").disabled=true;
    document.getElementById("form1").disabled=true;
   }
  }
 }
 
 return false;
}	