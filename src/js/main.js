/**
 * main.js
 * Entrypoint for webpack
 */
import ready from './utils/ready';
import registerServiceWorker from './utils/serviceWorker';
import { info } from './utils/debug';

import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world';

import './about';

function onReady(e) {
  registerServiceWorker();
  info(`Event: ${e.type}`, `Datestamp: ${this.date}`);
}

ready(onReady, {
  date: new Date(),
});

let wow;

var mapEmbassyTitle = {
  'cz': 'office@liberland.org',
  'hr': 'croatia@liberland.org',
  'rs': 'serbia@liberland.org',
  'fr': 'france@liberland.org',
  'no': 'norway@liberland.org',
  'de': 'germany@liberland.org',
  'us': 'usa@liberland.org',
  'hu': 'hungary@liberland.org',
  'si': 'slovenia@liberland.org',
  've': 'venezuela@liberland.org',
  'gb': 'uk@liberland.org',
  'pl': 'poland@liberland.org',
  'pa': 'panama@liberland.org',
  'se': 'sweden@liberland.org',
  'om': 'oman@liberland.org',
  'li': 'liechtenstein@liberland.org',
  'br': 'brazil@liberland.org',
  'sk': 'slovakia@liberland.org',
  'ar': 'argentina@liberland.org',
  'il': 'israel@liberland.org',
  'ly': 'libya@liberland.org',
  'mx': 'mexico@liberland.org',
  'ch': 'switzerland@liberland.org',
  'es': 'spain@liberland.org',
  'tw': 'taiwan@liberland.org',
  'mn': 'mongolia@liberland.org',
  'at': 'austria@liberland.org',
  'mk': 'macedonia@liberland.org',
  'ec': 'ecuador@liberland.org',
  'in': 'india@liberland.org',
  'ua': 'ukraine@liberland.org',
  'be': 'belgium@liberland.org',
  'ba': 'bosnia@liberland.org',
  'ca': 'canada@liberland.org',
  'tr': 'turkey@liberland.org',
  'cn': 'china@liberland.org',
  'eg': 'egypt@liberland.org',
  'ru': 'russia@liberland.org',
  'dk': 'denmark@liberland.org',
  'th': 'thailand@liberland.org',
  'vn': 'vietnam@liberland.org',
  'nl': 'netherland@liberland.org',
  'ie': 'ireland@liberland.org',
  'pk': 'pakistan@liberland.org',
  'bd': 'bangladesh@liberland.org',
  'uy': 'uruguay@liberland.org neni',
  'gt': 'guatemala@liberland.org',
  'jp': 'japan@liberland.org',
  'ge': 'georgia@liberland.org',
  'cl': 'chile@liberland.org',
  '_2': 'somaliland@liberland.org'
};

$(document).ready(function(){
  jQuery('#vmap').vectorMap(
  {
    map: 'world_en',
    backgroundColor: 'transparent',
    color: '#fff',
    hoverOpacity: 0.8,
    enableZoom: false,
    selectedColor: '#FFCB05',
    normalizeFunction: 'polynomial',
		onLabelShow: function(e, el, code){
			if(typeof mapEmbassyTitle[code] != 'undefined'){
				let title = mapEmbassyTitle[code];
	      		el.html(el.html()+' -&nbsp;'+title);
			}
    },
    onRegionClick: function(element, code, region) {
      window.location.href = "#" + code
    }

  });
});


  var initmain = function() {

  	// particles
  	particlesJS("particles-js", {
  		"particles": {
  			"number": {
  				"value": 60,
  				"density": {
  					"enable": true,
  					"value_area": 800
  				}
  			},
  			"color": {
  				"value": "#555"
  			},
  			"shape": {
  				"type": "circle",
  				"stroke": {
  					"width": 0,
  					"color": "#000000"
  				},
  				"polygon": {
  					"nb_sides": 3
  				},
  				"image": {
  					"src": "img/github.svg",
  					"width": 170,
  					"height": 100
  				}
  			},
  			"opacity": {
  				"value": 1,
  				"random": false,
  				"anim": {
  					"enable": false,
  					"speed": 1,
  					"opacity_min": 0.1,
  					"sync": false
  				}
  			},
  			"size": {
  				"value": 15,
  				"random": true,
  				"anim": {
  					"enable": false,
  					"speed": 40,
  					"size_min": 0.1,
  					"sync": false
  				}
  			},
  			"line_linked": {
  				"enable": true,
  				"distance": 200,
  				"color": "#ffffff",
  				"opacity": 0.2,
  				"width": 2
  			},
  			"move": {
  				"enable": true,
  				"speed": 1.3,
  				"direction": "none",
  				"random": true,
  				"straight": false,
  				"out_mode": "out",
  				"bounce": false,
  				"attract": {
  					"enable": false,
  					"rotateX": 600,
  					"rotateY": 1200
  				}
  			}
  		},
  		"interactivity": {
  			"detect_on": "canvas",
  			"events": {
  				"onhover": {
  					"enable": false,
  					"mode": "repulse"
  				},
  				"onclick": {
  					"enable": false,
  					"mode": "push"
  				},
  				"resize": true
  			},
  			"modes": {
  				"grab": {
  					"distance": 400,
  					"line_linked": {
  						"opacity": 1
  					}
  				},
  				"bubble": {
  					"distance": 400,
  					"size": 40,
  					"duration": 2,
  					"opacity": 8,
  					"speed": 3
  				},
  				"repulse": {
  					"distance": 200,
  					"duration": 0.4
  				},
  				"push": {
  					"particles_nb": 4
  				},
  				"remove": {
  					"particles_nb": 2
  				}
  			}
  		},
  		"retina_detect": true
  	});

  	// map
  	// The latitude and longitude of your business / place
  	var position = [45.7736431, 18.8869826]; // 45.7736431,18.8869826,15.92z

  	function showGoogleMaps() {

  		var latLng = new google.maps.LatLng(position[0], position[1]);

  		var mapOptions = {
  			zoom: 12, // initialize zoom level - the max value is 21
  			streetViewControl: false, // hide the yellow Street View pegman
  			scaleControl: true, // allow users to zoom the Google Map
  			mapTypeId: google.maps.MapTypeId.ROADMAP,
  			center: latLng,
  			styles: [
  				{
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#f5f5f5"
  						}
  					]
  				},
  				{
  					"elementType": "labels.icon",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#616161"
  						}
  					]
  				},
  				{
  					"elementType": "labels.text.stroke",
  					"stylers": [
  						{
  							"color": "#f5f5f5"
  						}
  					]
  				},
  				{
  					"featureType": "administrative.country",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#ffcb05"
  						},
  						{
  							"visibility": "on"
  						},
  						{
  							"weight": 3
  						}
  					]
  				},
  				{
  					"featureType": "administrative.land_parcel",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "administrative.land_parcel",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#bdbdbd"
  						}
  					]
  				},
  				{
  					"featureType": "administrative.neighborhood",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "administrative.neighborhood",
  					"elementType": "geometry.fill",
  					"stylers": [
  						{
  							"color": "#808080"
  						},
  						{
  							"visibility": "on"
  						}
  					]
  				},
  				{
  					"featureType": "landscape.man_made",
  					"elementType": "geometry.fill",
  					"stylers": [
  						{
  							"color": "#808080"
  						}
  					]
  				},
  				{
  					"featureType": "landscape.natural",
  					"elementType": "geometry.fill",
  					"stylers": [
  						{
  							"color": "#e4e3e4"
  						}
  					]
  				},
  				{
  					"featureType": "landscape.natural.terrain",
  					"elementType": "geometry.fill",
  					"stylers": [
  						{
  							"color": "#d0d0d0"
  						}
  					]
  				},
  				{
  					"featureType": "poi",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#eeeeee"
  						}
  					]
  				},
  				{
  					"featureType": "poi",
  					"elementType": "labels.text",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "poi",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#757575"
  						}
  					]
  				},
  				{
  					"featureType": "poi.business",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "poi.park",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#e5e5e5"
  						}
  					]
  				},
  				{
  					"featureType": "poi.park",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#9e9e9e"
  						}
  					]
  				},
  				{
  					"featureType": "road",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#ffffff"
  						}
  					]
  				},
  				{
  					"featureType": "road",
  					"elementType": "geometry.stroke",
  					"stylers": [
  						{
  							"color": "#ffffff"
  						},
  						{
  							"weight": 5
  						}
  					]
  				},
  				{
  					"featureType": "road",
  					"elementType": "labels",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "road",
  					"elementType": "labels.icon",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "road.arterial",
  					"elementType": "geometry.stroke",
  					"stylers": [
  						{
  							"color": "#ffffff"
  						},
  						{
  							"weight": 5
  						}
  					]
  				},
  				{
  					"featureType": "road.arterial",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#757575"
  						}
  					]
  				},
  				{
  					"featureType": "road.highway",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#dadada"
  						}
  					]
  				},
  				{
  					"featureType": "road.highway",
  					"elementType": "geometry.stroke",
  					"stylers": [
  						{
  							"color": "#ffffff"
  						},
  						{
  							"weight": 4
  						}
  					]
  				},
  				{
  					"featureType": "road.highway",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#616161"
  						}
  					]
  				},
  				{
  					"featureType": "road.local",
  					"elementType": "geometry.stroke",
  					"stylers": [
  						{
  							"color": "#ffffff"
  						},
  						{
  							"visibility": "on"
  						},
  						{
  							"weight": 5
  						}
  					]
  				},
  				{
  					"featureType": "road.local",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#9e9e9e"
  						}
  					]
  				},
  				{
  					"featureType": "transit",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "transit.line",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#e5e5e5"
  						}
  					]
  				},
  				{
  					"featureType": "transit.station",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#eeeeee"
  						}
  					]
  				},
  				{
  					"featureType": "water",
  					"elementType": "geometry",
  					"stylers": [
  						{
  							"color": "#c9c9c9"
  						}
  					]
  				},
  				{
  					"featureType": "water",
  					"elementType": "geometry.fill",
  					"stylers": [
  						{
  							"color": "#35373a"
  						}
  					]
  				},
  				{
  					"featureType": "water",
  					"elementType": "labels.text",
  					"stylers": [
  						{
  							"visibility": "off"
  						}
  					]
  				},
  				{
  					"featureType": "water",
  					"elementType": "labels.text.fill",
  					"stylers": [
  						{
  							"color": "#9e9e9e"
  						}
  					]
  				}
  			]
  		};

  		map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
  		var llSurface = [
  			{ lat: 45.78381, lng: 18.86962 },
  			{ lat: 45.77968, lng: 18.86105 },
  			{ lat: 45.77651, lng: 18.85503 },
  			{ lat: 45.77393, lng: 18.85117 },
  			{ lat: 45.77192, lng: 18.85101 },
  			{ lat: 45.76902, lng: 18.85151 },
  			{ lat: 45.76551, lng: 18.85497 },
  			{ lat: 45.76237, lng: 18.85923 },
  			{ lat: 45.7595 , lng: 18.86739 },
  			{ lat: 45.75711, lng: 18.87629 },
  			{ lat: 45.75503, lng: 18.88565 },
  			{ lat: 45.75219, lng: 18.89185 },
  			{ lat: 45.7648 , lng: 18.88997 },
  			{ lat: 45.7715 , lng: 18.88859 },
  			{ lat: 45.77633, lng: 18.88572 },
  			{ lat: 45.78045, lng: 18.87966 },
  			{ lat: 45.78254, lng: 18.87716 },
  			{ lat: 45.78372, lng: 18.87439 },
  			{ lat: 45.78381, lng: 18.86962 }
  		];

  		// Construct the polygon.
  		var surface = new google.maps.Polygon({
  			paths: llSurface,
  			strokeColor: '#FFCB05',
  			strokeOpacity: 0.95,
  			strokeWeight: 2,
  			fillColor: '#FFCB05',
  			fillOpacity: 0.35
  		});
  		surface.setMap(map);
  	}

  	google.maps.event.addDomListener(window, 'load', showGoogleMaps);

  	// count up
  	var options = {
  		useEasing: true,
  		useGrouping: true,
  		separator: ',',
  		decimal: '.',
  	};

  	var citizenships_num = 500,
  	companies_num = 65,
  	offices_num = 95;

  	var citizenships = new CountUp('citizenships', 0, citizenships_num, 0, 1.5, options);
  	var companies = new CountUp('companies', 0, companies_num, 0, 3.5, options);
  	var offices = new CountUp('offices', 0, offices_num, 0, 5.5, options);

  	// setup page animations on scroll
  	wow = new WOW({
  		boxClass:     'wow',      // default
  		animateClass: 'animated', // default
  		offset:       0,          // default
  		mobile:       true,       // default
  		live:         true,       // default
  		callback:     function(box) {
  			// Start countup when area reached
  			if(!citizenships.error && $(box).hasClass('figures')) {
  				citizenships.start();
  				companies.start();
  				offices.start();
  			}
  		}
  	});

  	// product icons
  	$("#products a.eres").hover(function(){
  		$(this).find("img").attr("src","images/icon-eres-animated.svg");
  	})
  	$("#products a.eres").mouseout(function(){
  		$(this).find("img").attr("src","images/icon-eres.svg");
  	})
  	$("#products a.pass").hover(function(){
  		$(this).find("img").attr("src","images/icon-pass-animated.svg");
  	})
  	$("#products a.pass").mouseout(function(){
  		$(this).find("img").attr("src","images/icon-pass.svg");
  	})
  	$("#products a.comp").hover(function(){
  		$(this).find("img").attr("src","images/icon-comp-animated.svg");
  	})
  	$("#products a.comp").mouseout(function(){
  		$(this).find("img").attr("src","images/icon-comp.svg");
  	})
  	$("#products a.car").hover(function(){
  		$(this).find("img").attr("src","images/icon-car-animated.svg");
  	})
  	$("#products a.car").mouseout(function(){
  		$(this).find("img").attr("src","images/icon-car.svg");
  	})
  }

  $(document).ready(function(){
    if($('body').hasClass('home')) {
    	initmain();
    	wow.init();

    	$(window).on('resize', function(){
    		if ( $(window).width() < 992 ) {
    			var position = [45.7736431, 18.8869826];
    		}
    	});
    }
  });
