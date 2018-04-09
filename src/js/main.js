/**
 * main.js
 * Entrypoint for webpack
 */
import ready from './utils/ready';
import registerServiceWorker from './utils/serviceWorker';
import { info } from './utils/debug';

import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world';

function onReady(e) {
  registerServiceWorker();
  info(`Event: ${e.type}`, `Datestamp: ${this.date}`);
}

ready(onReady, {
  date: new Date(),
});

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
  				title = mapEmbassyTitle[code];
  	      		el.html(el.html()+' -&nbsp;'+title);
  			}
      },
      onRegionClick: function(element, code, region) {
        window.location.href = "#" + code
      }

    });
  });
