$(document).ready(function(){

	//Get Lat and Long from HTML5 API
	var position;

	if (navigator.geolocation) {	
	    navigator.geolocation.getCurrentPosition(showPosition);
	} 
	else {
	    alert("Geolocation is not supported by this browser.");
	}

	function showPosition(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
	    retrieveData();	
	}

	function retrieveData(){
		//Uses Ajax request to convert lat/long into location data
		$.ajax({
		    url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false',
		    success: function(data){
		        var formatted = data.results;
				console.log(formatted);
		       	var address_array = formatted[1].formatted_address.split(',');
				console.log(address_array);
		        var lji_location = address_array[0];
				
				
				
				
				//this is talking to the simpleweather js plugin
				$(function() {
					console.log(lji_location);
				  $.simpleWeather({
				    location: lji_location,
				    unit: 'c',
				    success: function(weather) {
						//return these results from Yahoo's data. docs for additional data types at http://simpleweatherjs.com/
					  html = '<h2>'+address_array+'</h2>';
				      html += '<h3>'+weather.temp+'&deg;C &amp; ' +weather.currently + '</h3>';
  
					  //if the wind chill is less than zero, then print it. otherwise, hide it
					  if (weather.wind.chill<0){
					  	html += '<p>Wind Chill: ' +weather.wind.chill + '</p>';
				  		}
	
						//do the logic to figure out the Long John Index
					if (weather.temp <= 0 && weather.temp >= -10 && weather.wind.chill == 0 ){
					  var LongJohnIndex = '<p>Current Long John Index: Low/Wimpy</p>';
					} else if ( weather.temp <= 0 && weather.temp >= -10 && weather.wind.chill <0){
					  var LongJohnIndex = '<p>Current Long John Index:  Moderate</p>';
					} else if ( weather.temp <= -10 && weather.temp >= -20){
					  var LongJohnIndex = '<p>Current Long John Index: High</p>';
					} else if ( weather.temp <= -20 && weather.temp >= -30){
					  var LongJohnIndex ='<p>Current Long John Index:  Crazy High</p>';
					} else if ( weather.temp <= -30){
					  var LongJohnIndex ='<p>Current Long John Index: Effin Nuts</p>';
					} else {
					  var LongJohnIndex ='<p>Uh oh! Looks like the interns spilled cola on the weather machine again.</p>';
					}

					//print the details for each city to its own unique div on the index page, using the index
				      $("#weather").html(html + LongJohnIndex);
				    },
					//if something kerplodes, show an error
				    error: function(error) {
						//console.log(window.lji_location);
				      	alert('error');
					  //$("#weather-"+index).html('<p>ABORT! ERROR! ERROR!</p>');
				    }
			      });
			    });
				
				
				
				
				
		   }
		});
	}
});

