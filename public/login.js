//https://www.w3schools.com/js/js_validation.asp

$('#createAccount').click(function(e){
  e.preventDefault()
  $(".login").hide();
  $(".signup").show();
});

$('#signIn').click(function(e){
  e.preventDefault()
  $(".login").show();
  $(".signup").hide();
});

$('#continue').click(function(e){
  e.preventDefault()
  
  if (validateSignUp()){
      $(".signup").hide();
      $(".info").show();
  }
});

function validateSignUp()
{
  
  var rEmail = document.forms["signup"]["email"];
  var rPass = document.forms["signup"]["pass"];
  var rCPass = document.forms["signup"]["cPass"];
  
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!rEmail.value.match(mailformat))
  {
    alert("You have entered an invalid email address!");
    return false;
  }

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

//========vPhone Number Formatterv=============
const isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};

const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
};

const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if(!isNumericInput(event) && !isModifierKey(event)){
        event.preventDefault();
    }
};

const formatToPhone = (event) => {
    if(isModifierKey(event)) {return;}

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
    const zip = input.substring(0,3);
    const middle = input.substring(3,6);
    const last = input.substring(6,10);

    if(input.length > 6){target.value = `(${zip}) ${middle} - ${last}`;}
    else if(input.length > 3){target.value = `(${zip}) ${middle}`;}
    else if(input.length > 0){target.value = `(${zip}`;}
};

// const inputElement = document.getElementById('phoneNumber');
// inputElement.addEventListener('keydown',enforceFormat);
// inputElement.addEventListener('keyup',formatToPhone);
//========^Phone Number Formatter^=============

$('.txtb input').on('focus', function(){
  $(this).addClass("focus");
});

$('.txtb input').on('blur', function(){
  if ($(this).val() == ""){
    $(this).removeClass("focus");
  }
});

$('.txtb input').on('input',function(e){
    $(this).addClass("focus");
});

$(function(){
   if ($('.txtb input').val() !== ""){
      $('.txtb input').addClass("focus");
   }
});