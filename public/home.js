//https://www.aspsnippets.com/Articles/Google-Maps-API-V3-Add-click-event-listener-to-all-multiple-markers.aspx

let clickable = true

if (user){
  $("#loginBtn").html(`${user.name}'s Profile`)
  $("#desc").html(user.desc)
  document.getElementById("cCount").innerHTML = count = document.getElementById("desc").value.length;
  document.querySelector(".lightbox").classList.add("closed");
}

 
$('#loginBtn').on('click',function(e){
    if ($(this).html() == "Sign Up" ){
      location.href = "/login";
    } else {
      swap();
    }
});

$('#cancelBtn').on('click',function(e){
  swap();
});

function validateDelete(){
  return confirm("Are you sure?")
}

//Edit form stuff
function validateEdit(){
  var rPass = document.forms["editForm"]["nPass"];
  var rCPass = document.forms["editForm"]["cnPass"];

  if(rPass.value == "" && rCPass.value == "")
    return true;

  if(rPass.value !== rCPass.value){
    alert("Your passwords do not match");
    return false;
  }
  
  var numbers = /[0-9]/g;
  var upperCaseLetters = /[A-Z]/g;
  var lowerCaseLetters = /[a-z]/g;
  if(!rPass.value.match(lowerCaseLetters) || !rPass.value.match(upperCaseLetters) || !rPass.value.match(numbers) || rPass.value.length < 8){
    alert("Your password does not meet the requirements")
    return false;
  }

  return true;
}

$('#editForm').submit(function() {
   event.preventDefault(); // Stops browser from navigating away from page

   let desc = document.forms["edit"]["desc"].value;
   let oPass = document.forms["edit"]["oPass"].value;
   let nPass = document.forms["edit"]["nPass"].value;

   if (desc == user.desc){
     desc = null
   }

   if (oPass == "" || nPass == ""){
     oPass = null;
     nPass = null;
   }
   

    var data = {
      desc,
      oPass,
      nPass
    };

    // build a json object or do something with the form, store in data
    $.post('/save', data, function(resp) {
      alert(resp.message)
     });
});


// shuffle who is displayed on the map
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 != currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  if(array.length > 3)
  {
    array = array.slice(0,3);
  }
  
  return array;
}

//to limit the map marker clicks
function makeClickable(){
  clickable = true;
  timeout = new timer(makeClickable, 10*1000);
}
let timeout = new timer(makeClickable, 10*1000);

function timer(callback, delay) {
    var id, started, remaining = delay, running

    this.start = function() {
        running = true
        started = new Date()
        id = setTimeout(callback, remaining)
    }

    this.pause = function() {
        running = false
        clearTimeout(id)
        remaining -= new Date() - started
    }

    this.getTimeLeft = function() {
        if (running) {
            this.pause()
            this.start()
        }

        return Math.round(remaining/1000)
    }

    this.getStateRunning = function() {
        return running
    }

    //this.start()
}

//sets up the map
function initMap() { 

  var map = new google.maps.Map(document.getElementById('map'), { 
    zoom: 6, 
    center: {lat: 41.8781, lng:  -87.6298}, //easter egg
    streetViewControl: false 
  }); 
  var infoWindow = new google.maps.InfoWindow();

  for (person of shoppers) {

    var marker = new google.maps.Marker({
      position: {lat: person.lat, lng: person.lng},
      map: map,
      title: person.city
    });
 
    //Attach click event to the marker.
    (function (marker, person) {
      google.maps.event.addListener(marker, "click", function (e) {
        if (clickable){
          map.setZoom(8);
          map.setCenter(marker.getPosition());
          
          const city = person.city
          const state = person.state
          var endString = ""
          var shopperArr = []

          for (people of shoppers){
            if (people.city.match(city) && people.state.match(state))
            {
              shopperArr.push([people.name, people.desc])
            }
          }

          shopperArr = shuffle(shopperArr);

          for (people of shopperArr)
          {
            endString += `<b>${people[0]}</b> - ${people[1]} <br><br>`
          }

          document.getElementById("shopperList").innerHTML = endString
        
          //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
          infoWindow.setContent(`<div> ${city}</div>`);
          

          infoWindow.open(map, marker);

          clickable = false;
          timeout.start()
        } else {
          alert(`Please wait ${timeout.getTimeLeft()} seconds before clicking another marker.`)
        }
      });
    })(marker, person);

  }

  //search bar stuff
  const searchBounds = new google.maps.places.Autocomplete($('#name'), { types: ['geocode'], componentRestrictions: {country: "us"} });
  
  var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
  google.maps.event.addListener(searchBox, 'places_changed', function() {
     searchBox.set('map', null);


     var places = searchBox.getPlaces();

     var bounds = new google.maps.LatLngBounds();
     var i, place;
     for (i = 0; place = places[i]; i++) {
       (function(place) {
         var marker = new google.maps.Marker({

           position: place.geometry.location
         });
         marker.bindTo('map', searchBox, 'map');
         google.maps.event.addListener(marker, 'map_changed', function() {
           if (!this.getMap()) {
             this.unbindAll();
           }
         });
         bounds.extend(place.geometry.location);

         marker.setMap(null);


       }(place));

     }
     map.fitBounds(bounds);
     searchBox.set('map', map);
     map.setZoom(Math.min(map.getZoom(),11));

  });
        
} 



function swap(){
  $('.overlay').each(function() {
        if ($(this).offset().left < 0) {
            $(this).animate({
                left: '30px',
            }, 500 );
        } else {
            $(this).animate({
                left: '-150%',
            }, 500 );
        }
    });
}

$('#change').click(function() {
  swap();
});

$('textarea').keyup(function() {
  document.getElementById("cCount").innerHTML = count = document.getElementById("desc").value.length;
});

lightBoxClose = function() {
  document.querySelector(".lightbox").classList.add("closed");
}

