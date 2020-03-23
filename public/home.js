//https://www.aspsnippets.com/Articles/Google-Maps-API-V3-Add-click-event-listener-to-all-multiple-markers.aspx


function initMap() { 

  var map = new google.maps.Map(document.getElementById('map'), { 
    zoom: 4.5, 
    center: {lat: 35.9451, lng: -104.1963} //chicago
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

        for (people of shoppers)
        {
          if (people.city.match(city) && people.state.match(state))
          {
            endString += `<b>${people.name}</b> - ${people.desc} <br><br>`
          }
        }

        document.getElementById("shopperList").innerHTML = endString
      
        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
        infoWindow.setContent(`<div> ${city}</div>`);
        

        infoWindow.open(map, marker);
      });
    })(marker, person);

  }
        
} 