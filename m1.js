mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q';

var bounds = [
  [-95.3566105298246, 13.0517966258875], // Southwest coordinates, , 
  [-85.2111927824501, 18.416632999923] // Northeast coordinates, 
];
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-90.3900017126126, 15.6055893260292], // starting position [lng, lat]
  zoom: 3,
  maxBounds: bounds,
  //scrollZoom: false
});
map.addControl(new mapboxgl.NavigationControl({
  showCompass: false
}));
map.on('load', function() {

  map.addSource('nonprofits', {
    type: 'vector',
    url: 'mapbox://imadaveloper.b29hf9g8'
  });

  map.addLayer({
    'id': 'npos',
    'type': 'circle',
    'source': 'nonprofits',
    'source-layer': 'nonprofitonetoone-clf0cp',
    'paint': {
      'circle-radius': [
        'match', ['get', 'PioneroAffiliation'],
        'P',
        6,
        /* other */
        5
      ],
      'circle-opacity': [
        'match', ['get', 'PioneroAffiliation'],
        'P',
        1,
        /* other */
        0.3
      ],
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 0.5,
      // color circles by partner status, using a match expression
      // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      'circle-color': [
        'match', ['get', 'PioneroAffiliation'],
        'P',
        '#6032ec',
        /* other */
        '#cfcdd5'
      ]
    }
  });

  map.on('click', 'npos', function(e) {
    popup.remove();

    var coordinates = e.features[0].geometry.coordinates.slice();
    flyToNonprofit(e.features[0]);
    let affiliation = '';
    switch (e.features[0].properties.PioneroAffiliation) {
      case 'P':
        affiliation = 'Partner';
        break;
      case 'DP':
        affiliation = 'Discontinued Partner';
        break;
      case 'E':
        affiliation = 'Eligible';
        break;
      case 'NE':
        affiliation = 'Not Eligible';

    }
    let gtreg = '';
    switch (e.features[0].properties.GuateReg) {
      case 'Asso':
        gtreg = 'Association';
        break;
      case 'Found':
        gtreg = 'Foundation';
        break;
      case 'NGO':
        gtreg = 'Non-governmental organization';
        break;
      case 'N':
        gtreg = 'Not Registered';

    }
    let gtgovfund = (e.features[0].properties.GuateGovtFunding == 'Y') ? 'Yes' : 'No';

    var description = '<h3>' + e.features[0].properties.NPO + '</h3>' +
      'Pionero Affiliation: ' + affiliation + '<br>' +
      'Seal of Excellence: ' + e.features[0].properties.SealExcellence + '<br>' +
      'Total Evaluation Score: ' + e.features[0].properties.TotalEvalScore + '<br>' +
      'Year Founded: ' + e.features[0].properties.YearFounded + '<br>' +
      'Nonprofit Size: ' + e.features[0].properties.Size + '<br>' +
      'Annual Budget: ' + e.features[0].properties.Budget + '<br>' +
      'Religious Affiliation: ' + e.features[0].properties.ReligiousAff + '<br>' +
      'Guatemala Registration: ' + gtreg + '<br>' +
      'Receives Government Funding: ' + gtgovfund + '<br>' +
      'Tax Registration: ' + e.features[0].properties.USTaxStatus;
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'npos', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    /*
      var partners = map.queryRenderedFeatures(e.point, {
        layers: ['nppartners']
      });
     */
    //var coordinates = [e.features[0].properties.Longitude, e.features[0].properties.Latitude];
    var coordinates = e.features[0].geometry.coordinates.slice();

    var npname = e.features[0].properties.NPO;


    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(npname).addTo(map);
  });


  map.on('mouseleave', 'npos', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});

let demoBtn = document.getElementById("choro");
demoBtn.onclick = function() {
  //if (map.getLayer('npos')) map.removeLayer('npos');
  map.setLayoutProperty('npos', 'visibility', 'none');

  if (map.getLayer('demos')) {
    map.setLayoutProperty('demos', 'visibility', 'visible');
  }
  map.addSource('demographics', {
    type: 'vector',
    url: 'mapbox://imadaveloper.a8fix28r'
  });

  map.addLayer({
    'id': 'demos',
    'type': 'fill',
    'source': 'demographics',
    'source-layer': 'gtdeptdemos-6ac35m',
    'paint': {
      'fill-color': [
        'step', ['get', 'Poverty Rate'],
        '#dcdcef', 10,
        '#c6c2ea', 20,
        '#b1a8e2', 30,
        '#9c8ed9', 40,
        '#8776ce', 50,
        '#725dc1', 60,
        "#5c45b4", 70,
        "#452da6", 80,
        "#2a1297"
      ],
      'fill-opacity': 0.6,
      'fill-outline-color': '#fff'
    }
  });
  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mousemove', 'demos', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var description = '<h4>' + e.features[0].properties.Department + '</h4>' +
      '<p>Poverty rate: ' + e.features[0].properties['Poverty Rate'] + '%</p>';

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'demos', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
  return false;
}

let nonprofBtn = document.getElementById("nonprof");

nonprofBtn.onclick = function() {
  map.setLayoutProperty('npos', 'visibility', 'visible');
  if (map.getLayer('demos')) {
    map.setLayoutProperty('demos', 'visibility', 'none');
  }
  return false;
}


function flyToNonprofit(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 10
  });
}