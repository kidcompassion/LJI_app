$(document).ready(function(){

	//Get Lat and Long from HTML5 API
	var position;

	if (navigator.geolocation) {	
	    navigator.geolocation.getCurrentPosition(showPosition);
	} 
	else {
	    $('#location').html("Sorry, we can't tell where you are! Make sure geolocation is enabled in your browser.");
	}

	function showPosition(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
	    retrieveData();	
	    console.log(position);
	}

	function retrieveData(){
		//Uses Ajax request to convert lat/long into location data
		$.ajax({

		    url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false',
		    success: function(data){
		    	console.log(data);
	  			var city;

	  			//loop through the results for given lat and long
	  			$.each(data.results, function(key, index){
	  				//drill into the types method to find the one tagged locality
	  				if ($.inArray('locality', index.types) != -1){
	  					console.log(index.address_components);
	  						
	  						//loop through these components again to find locality and long name
		  					$.each(index.address_components, function( types, names){
		  					
		  						if ($.inArray('locality', names.types)!= -1){
		  							console.log(names.long_name);
		  							city = names.long_name;
		  						}
		  					});
	  				}

	  			});


				$.ajax({
				
					url: 'http://api.wunderground.com/api/'+ config +'/geolookup/conditions/forecast/q/Canada/Edmonton.json',
				//	url: 'https://api.worldweatheronline.com/free/v2/weather.ashx?q=' + lat + ',' + lng + 'q=' +city+ '&cc=no&showlocaltime=yes&format=json&key=07de03003eb963dedf276897040ac',
					dataType: 'json',
					success: function(data){
						console.log(data);
						var test = data.data.weather[0].hourly[0];
						console.log(test);
						var icon = data.data.weather[0].hourly[0].weatherIconUrl[0].value;
						var windchill = test.WindChillC;
						var currenttemp = test.tempC;
						console.log('windchill' + test.WindChillC);
						console.log('temp' + test.tempC);
						$('#location').html('Look like you\'re in ' + city );
						$('#current').html('<p><img src="'+ icon +'"/></p><p>The current temperature is ' + currenttemp+'. The current windchill is ' + windchill + '. </p>');
						

					  	if (currenttemp >= -9 && windchill >= -9 ){
						  var LongJohnIndex = '<p>1</p>';
						  var one = '<li>Temperature Range: 0 to – 9 Celsius ( 32 to 15.8 Fahrenheit).</li>'; 
							one += '<li>Windchill: None.</li>';
							one += '<li>Length of time you can be outside without Long Johns: 4-5 Hours*</li>';
							one += '<li>Explanation: Long Johns shouldn\'t be needed, unless one is spending 7+ hours outside with no toque and standing so still they might be mistaken for one of those creepy living mannequins. Any movement will generate enough body heat to not need Long Johns.</li>';
							one += '<li><em>*Should you live in a part of the Canada not considered classically frigid, you may want to wear some Long Johns if outside for more than an hour. Looking at you, Vancouver and Toronto.</em></li>';
							var descrip = one;

						} else if ( currenttemp >= -9 && windchill <= -10 && windchill >=-19){
						  var LongJohnIndex = '<p>2</p>';
						  var two = '<li>Temperature Range: Same as Above</li>';
							two += '<li>Windchill - anything that makes the temperature feel like it is colder than -10 Celsius ( 14 Fahrenheit)</li>';
							two += '<li>Length of time you can be outside without Long Johns: 1-2 Hours</li>';
							two += '<li>Explanation:This is the only level which we acknowledge the very baffling and evil existence of Windchill*, as there is a very discernible difference between going outside when it\'s -5 with no wind, and a -5 when the wind is strong enough to knock over mini vans. Basically, if it\'s minus -5, but feels like -43, and you are going to be outside for an hour, you should wear your Long Johns.</li>';
							var descrip = two;

						} else if ( currenttemp <= -10 && currenttemp >= -19){
						  var LongJohnIndex = '<p>3</p>';
						  var three = '<li>Temperature Range: -10 to -19 Celsius ( 14 to -2 Fahrenheit).</li>'; 
							three += '<li>Length of time you can be outside without Long Johns: 30-60 Minutes</li>';
							three += '<li>Explanation: Now we are at some serious winter temperatures, during which time the phrase \'bundling up\' will be commonly used, and listened too. At this temperature, your Thighs will give you that "Burny feeling", which is your body\'s way of telling you aren\'t dressed warm enough, and you should think the next time you go outside. If you are outside for commuting, working, or walking various domesticated pets (Dogs, Cats, or the occasional Moose) definitely put on some Long Johns.</li>';
							var descrip = three;
						} else if ( currenttemp <= -20 && currenttemp >= -29){
						  var LongJohnIndex ='<p>4</p>';
						  	var four = '<li>Temperature Range: -20 to -29 Celsius (-4 to -20.2 Fahrenheit).</li>'; 
							four += '<li>Length of time you can be outside without Long Johns: 15 minutes maximum.</li>'
							four += '<li>Explanation: At this point, there is no messing around. You should absolutely have your Long Johns on if you are spending any sort of time outside for any length of time. Doing so will not only keep you warm, but make you feel like an Astronaut, venturing out into the cold reaches of Space, though at this temperature, Space is probably warmer.</li>'; 
							var descrip = four;
						} else if ( currenttemp <= -30){
						  var LongJohnIndex ='<p>5</p>';
						  var five = 'Temperature Range: -30 Celsius and colder (-22 Fahrenheit and colder).';
							five += 'Length of time you can be outside without Long Johns: 0 Seconds.';
							five +='Explanation: Long Johns should be worn INDOORS. Don’t even bother going outdoors. Don’t even look at the outdoors, unless you have Long Johns for your eyes. It’s that cold. Instead, make some tea, grab a nice book, wrap yourself in as many towels and blankets as you can and just stay inside. When it’s nice out, someone will tell you.';
							var descrip = five;
						} else {
						  var LongJohnIndex ='<p>Uh oh! Looks like the intern spilled cola on the weather machine again.</p>';
						}

						$('#lji').html('<span>Current Long John Index: </span>' + LongJohnIndex);
						$('#description').html('<h2>What a Long John Index of '+ LongJohnIndex +'Means:</h2><ul>' + descrip + '</ul>');
			
					},
					error: function(data){
						console.log(data);
					}
					  
					});
			

		   }
		});
	}
});

