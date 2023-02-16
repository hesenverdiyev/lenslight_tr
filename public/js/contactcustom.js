var inputElements = document.querySelectorAll(".form_control");
var nameElement = document.getElementById("nameplace");
var emailElement = document.getElementById("emailplace");
var messageElement = document.getElementById("messageplace");
var submitButton = document.getElementById("submitButton");
var emailerror = document.getElementById("emailerror");
var emailValue = emailElement.value.trim();
const emailRegex = 
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

inputElements.forEach(function(inputElement) {
  inputElement.addEventListener("keyup", function() {
    var nameValue = nameElement.value.trim();
    var emailValue = emailElement.value.trim();
    var messageValue = messageElement.value.trim();
   
    // Check if all required fields are not blank and email is valid
    if (nameValue !== "" && emailValue !== "" && messageValue !== "" && emailRegex.test(emailValue)) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
});

inputElements[2].addEventListener("click",function(){
    var emailValue = emailElement.value.trim();
 if (emailValue !== "" && emailRegex.test(emailValue)){
    return true
 } else{
    emailerror.style.display = "block";
    setTimeout(function() {emailerror.style.display = "none"},2000);
}
});