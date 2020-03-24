//https://www.aspsnippets.com/Articles/Google-Maps-API-V3-Add-click-event-listener-to-all-multiple-markers.aspx

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function initMap() { 

  var map = new google.maps.Map(document.getElementById('map'), { 
    zoom: 4, 
    center: {lat: 45.3071089, lng:  -116.3640209}, //easter egg
    streetViewControl: false 
  }); 
  var infoWindow = new google.maps.InfoWindow();

  for (person of shoppers) {

    var marker = new google.maps.Marker({
      position: {lat: person.lat, lng: person.lng},
      map: map,
      title: person.name
    });
 
    //Attach click event to the marker.
    (function (marker, person) {
      google.maps.event.addListener(marker, "click", function (e) {

        map.setZoom(8);
        map.setCenter(marker.getPosition());
        
        const city = person.city
        const state = person.state
        var endString = ""
        var shopperArr = []

        for (people of shoppers)
        {
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
      });
    })(marker, person);

  }
        
} 

function swap()
{
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

$('#locationDiv').click(function() {
  swap();
});