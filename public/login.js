//https://www.w3schools.com/js/js_validation.asp

$('.createAccount').click(function(e){
  e.preventDefault()
  $(".login").hide();
  $(".forgot").hide();
  $(".signup").show();
});

$('#signIn').click(function(e){
  e.preventDefault()
  $(".login").show();
  $(".forgot").hide();
  $(".signup").hide();
});

$('#forgotBtn').click(function(e){
  e.preventDefault()
  $(".forgot").show();
  $(".login").hide();
  $(".signup").hide();
});

$('#continue').click(function(e){
  e.preventDefault()
  
  if (validateSignUp()){
      $(".signup").hide();
      $(".info").show();
  }
});

function validateSignUp(){
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

$('#signupForm').submit(function() {
   event.preventDefault(); // Stops browser from navigating away from page
    var data = {
      email: document.forms["signup"]["email"].value,
      pass: document.forms["signup"]["pass"].value,
      name: document.forms["signup"]["name"].value,
      city: document.forms["signup"]["city"].value,
      state: document.forms["signup"]["state"].value,
      desc: document.forms["signup"]["desc"].value
    };
    // build a json object or do something with the form, store in data
    $.post('/create', data, function(resp) {
       if (resp.status == "error"){
         alert(resp.message)
       } else {
         window.location.replace("/");
       }
     })
});

$("#loginForm").submit(function(){
    event.preventDefault(); // Stops browser from navigating away from page
    var data = {
      email: document.forms["loginForm"]["email"].value,
      password: document.forms["loginForm"]["password"].value,
    };
    // build a json object or do something with the form, store in data
    $.post('/login', data, function(resp) {
       if (resp.status == "error"){
         alert(resp.message)
       } else {
         window.location.replace("/");
       }
     })
});

$("#forgotForm").submit(function(){
    event.preventDefault(); // Stops browser from navigating away from page
    var data = {
      email: document.forms["forgotForm"]["email"].value,
    };
    // build a json object or do something with the form, store in data
    $.post('/forgot', data, function(resp) {
        alert(resp.message)
     })
});

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

$('textarea').keyup(function() {
  document.getElementById("cCount").innerHTML = count = document.getElementById("desc").value.length;
});