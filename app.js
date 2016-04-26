var data = require('./data.json');
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvaGFja2VyIiwiYSI6ImFIN0hENW8ifQ.GGpH9gLyEg0PZf3NPQ7Vrg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v8', //stylesheet location
    center: [79.0806, 21.1498], // starting position
    zoom: 4, // starting zoom
    hash: true
});

map.on('style.load', function() {

    var featureCollection = {
        'type': 'FeatureCollection',
        'features': []
    };

    data.forEach(function(d) {
        var feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [d.lon, d.lat]
            },
            'properties': {}
        };
        var keys = Object.keys(d);
        keys.forEach(function(k) {
            feature.properties[k] = d[k];
        });
        if (d.aqi <= 50) {
            feature.properties['color'] = 'green';
        }
        if (d.aqi > 50 && d.aqi < 80) {
            feature.properties['color'] = 'yellow';
        }
        if (d.aqi > 100) {
            feature.properties['color'] = 'red';
        }
        featureCollection.features.push(feature);
    });

    console.log(featureCollection);
    var airSource = {
        'type': 'geojson',
        'data': featureCollection,
        'cluster': true,
        'clusterMaxZoom': 15,
        'clusterRadius': 20
    };

    map.addSource('airSource', airSource);

    var airStyle = {
        'id': 'airCircle',
        'source': 'airSource',
        'type': 'circle',
        'paint': {
            'circle-radius': 70,
            'circle-color': {
                'stops': [[0, 'green'], [50, 'yellow'], [80, 'pink'] ,[110, 'red']],
                'property': 'aqi' 
            },
            'circle-blur': 1
        }
    };
    map.addLayer(airStyle);
});