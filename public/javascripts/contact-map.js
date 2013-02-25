var map;
var canvas = document.getElementById('map_canvas');
function initialize() {
	var myLatlng = new google.maps.LatLng(-33.443814,-70.644289);
	var mapOptions = {
		zoom: 15,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	map = new google.maps.Map(canvas, mapOptions);

	var contentString =
		'<strong>David Rojas Camaggi</strong>'+
		'<br>' +
		'<small>Marcoleta 594, Depto 9, Santiago</small>'+
		'<br>' +
		'<i class="icon-mobile-phone icon-large"><i/> <small><a class="tele" href="tel:56987322336">09 873 22 336</a></small>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 500
	});

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: 'My home'
	});

	//- google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	//- });
	var currentPoint = new google.maps.LatLng(-33.44018,-70.643377); 
	map.panTo(currentPoint);
}
$('body').on('loaded', initialize);