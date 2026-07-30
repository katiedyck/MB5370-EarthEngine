// ******************************************************************************* //
// EARTH ENGINE WORKSHOP 4 - Allen Coral Atlas //
// ******************************************************************************* //

/* We're field biologists trying to conduct research on corals. We're trying to decide
which station we should spend our research funds on to conduct our fieldwork. We want 
to maximise the amount of coral we can sample while we spend time at the research 
station. Because of limited funds, we have to conduct fieldwork from the shore. We 
will use Earth Engine to conduct a spatial analysis of the coral surrounding the
station. */


// Global Variables
var distance = 800  // meters we're allowed to snorkel from the station

// Research station locations
// use geometry tools to make a POINT FEATURE for each station's coordinate locations
Map.setOptions('SATELLITE');
Map.setCenter(0, 0, 2.5);

// Make a Feature for each station (Property: station)
//
// Map.setCenter(151.914, -23.441, 17);  // zoom to Heron Island
// Map.setCenter(148.958, -20.346, 15);  // zoom to Hamilton Island
// Map.setCenter(145.446, -14.668, 17);  // zoom to Lizard Island
// Map.setCenter(148.816, -20.252, 17);  // zoom to Daydream Island
// Map.setCenter(146.500, -18.634, 17);  // zoom to Orpheus Island
// Map.setCenter(123.765, -5.458, 17);  // zoom to Hoga Island, Indonesia
// Map.setCenter(-88.082, 16.803, 17);  // Carrie Bow Cay Field Station, Belize
// Map.setCenter(-90.303, -0.744, 17);  // Isla Santa Cruz, Ecuador
// Map.setCenter(-149.826434, -17.490772, 17);  // Mo'orea, French Polynesia
// Map.setCenter(46.206, -9.401, 17);  // Aldabra Atoll, Seychelles

// Build a FeatureCollection of all the stations
var field_stations = ee.FeatureCollection([Heron, Hoga, Hamilton, Lizard, Daydream,
  Orpheus, Belize, CharlesDarwin, GumpSouthPacific, Seychelles]);
print('Field Stations', {color: 'yellow'}, field_stations);

// Import Allen Coral Atlas data
var coralAtlas = ee.Image("ACA/reef_habitat/v2_0");
print('Allen Coral Atlas', coralAtlas);
Map.addLayer(coralAtlas, {}, 'ACA', false);

/* var reefExtent = coralAtlas.select('reef_mask').selfMask();
Map.addLayer(reefExtent, {}, 'Global reef extent');

var geomorphicZonation = coralAtlas.select('geomorphic').selfMask();
Map.addLayer(geomorphicZonation, {}, 'Geomorphic zonation');

var benthicHabitat = coralAtlas.select('benthic').selfMask();
Map.addLayer(benthicHabitat, {}, 'Benthic habitat'); */

// Extract coral cover class
var coral = coralAtlas  // 'benthic' layer
  .eq(15)  // returns 1 if true
  .selfMask();  // remove all 0 values
Map.addLayer(coral, {color: '#C20FBC'}, 'coral only');

// Buffer - distance from station (800 m)
var station_buffer = ee.Feature(field_stations.first()).buffer(800);
Map.addLayer(station_buffer, {}, 'station_buffer', false);

// To run as a .map - looping over all stations - we will need to make a function
var bufferer = function (feature) {
  // applies a buffer to a feature when given ...
  var buffered = feature.buffer(800)
  return buffered;
};

var bufferedStations = field_stations.map(bufferer);  // called "out" in workshop manual ***
print('bufferedStations', bufferedStations);
Map.addLayer(bufferedStations, {color: 'yellow'}, 'bufferedStations');


// Compute area of coral -- within buffer --
var area_pixels = ee.Image(ee.Image.pixelArea()).updateMask(coral); // mask out pixels that don't intersect coral

var area_out = area_pixels.reduceRegions({
  reducer: ee.Reducer.sum(),
  collection: bufferedStations,
  scale: 5
})

print('area_out', area_out);  // area of coral (m2) inside each buffer

var coral_area = coral  // binary 1 == coral
  .multiply(ee.Image.pixelArea())
  .reduceRegions({
    reducer: ee.Reducer.sum(),  // sum all pixel areas together
    collection: bufferedStations,
    scale: 5
  });
print('coral area', coral_area.sort('benthic', false));  // sorted in desc. order
Map.addLayer(coral_area, {color: '33FF00'}, 'Coral area within station buffers');


// Clean it up

var cleaner = function (feature) {
  // cleans my output
  var clean = {
    station_name: feature.get('Field_Station'),
    area_m2: ee.Number(feature.get('sum')),
    area_km2: ee.Number(feature.get('sum')).divide(1000*1000),
    analyst: 'katie'
  }
  return feature.set(clean);
}

var cleaned_result = coral_area.map(cleaner).sort('area_km2', false);
print('Cleaned', cleaned_result);


// Package up results and export

Export.table.toDrive({
  collection: cleaned_result, //FYI - type: featureCollection
  description: 'exportToDrive',
  fileNamePrefix: 'research_stations',
  fileFormat:'CSV'
});

var exportImage = coral.clip(bufferedStations);
Map.addLayer(exportImage);

Export.image.toDrive({
  image: exportImage, //FYI - type: Image
  description: 'exportImageToDrive',
  fileNamePrefix: 'aca_heron',
  fileFormat:'GeoTIFF',
  scale:5,
  region:Heron
});
