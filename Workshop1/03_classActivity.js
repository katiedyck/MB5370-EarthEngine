// *********************************************************************************//
// WORKSHOP 1 PART 3 //
// Earth Engine Basics //
// *********************************************************************************//

// Import a single image
var dataset = ee.Image('OSU/GIMP/DEM');
var elevation = dataset.select('elevation');
var elevationVis = {
  min: 0.0,
  max: 2000.0,
  palette: ["0C30C2", "18DBDE", "green", "yellow", "orange", "red"]
};
Map.setCenter(-41.0, 76.0, 3);
Map.addLayer(elevation, elevationVis, 'Elevation');

// Import a single feature
var currents = ee.Feature