// ************************************************************** //
// WORKSHOP 1 PART 2 //
// Earth Engine Basics //
// ************************************************************** //

var a = 1;
var b = 2;
print(a);
print(b);
print(a * b);
print(b*b);

var result = a + b;
print(result, "javascript way");

var result = ee.Number(a).add(b);
print(result, "Earth Engine way");

var a1 = ee.Number(1);
var a2 = ee.Number(3);
var result2 = print(a1.add(a2)); // Earth Engine way

// Using a . between two variables is similar to piping (%>%) in R

var yearList = ee.List.sequence(1980, 2025, 5);
print(yearList);

//
// EARTH ENGINE DATA STRUCTURES
//

print(Map.getBounds());

Map.setOptions("SATELLITE");
// var snazzy = require("users/aazuspan/snazzy:styles");
// snazzy.addStyle("https://snazzymaps.com/style/48750/blank-map", "Blank");
Map.setCenter(174.0638, -39.298, 11); // zoom to Mount Taranaki, New Zealand

// Import SRTM data
var dataset = ee.Image("CGIAR/SRTM90_V4");
print(dataset); // Look at data properties

Map.addLayer(dataset);
Map.addLayer(dataset, {min: 0, max: 2500}, 'custom visualization');
/* 3rd parameter is name of layer, visible under 'Layers' in top right corner
of map window */

Map.addLayer(dataset, {min: 0, max: 2500, palette: ['blue', 'green', 'red']}, 'custom palette');

// Set up visualisation parameters
var elevationVis = {
  min: 0,
  max: 2500,
  palette: ['0000ff', '00ffff', 'ffff00', 'ff0000', 'ffffff']
};

// Add the data layer to the map
Map.addLayer(dataset, elevationVis, 'Elevation');

//
// Features

// Add the protected planet data
var protected_areas = ee.FeatureCollection("WCMC/WDPA/current/polygons");
Map.addLayer(protected_areas);
Map.addLayer(protected_areas, {color: 'yellow'}, 'Protected Areas');
  // Under "Inspector" tab you can click on a polygon on the map to view info