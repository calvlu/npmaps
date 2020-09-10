mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/imadaveloper/ckew3bjyf0d8g1bmikc4wcngn', // style URL
        center: [-90.194329, 15.819034], // starting position [lng, lat]
        zoom: 7.2 // starting zoom
    });

map.on('load', function() {


  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
 
  map.on('mouseenter', 'npos', function (e) {
  // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
/*
  var partners = map.queryRenderedFeatures(e.point, {
    layers: ['nppartners']
  });
 */
    var coordinates = [e.features[0].properties.Longitude, e.features[0].properties.Latitude];
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
 
  map.on('mouseleave', 'npos', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});