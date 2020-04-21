function validateEdit(){
  var rPass = document.forms["editForm"]["password"];
  var rCPass = document.forms["editForm"]["confirm"];

  if(rPass.value == "" && rCPass.value == "")
    return true;

  if(rPass.value != rCPass.value)
  {
    alert("Your passwords do not match");
    return false;
  }
  
  var numbers = /[0-9]/g;
  var upperCaseLetters = /[A-Z]/g;
  var lowerCaseLetters = /[a-z]/g;
  if(!rPass.value.match(lowerCaseLetters) || !rPass.value.match(upperCaseLetters) || !rPass.value.match(numbers) || rPass.value.length < 8)
  {
    alert("Your password does not meet the requirements")
    return false;
  }

  return true;
}