// ************************************************************************* //
// EARTH ENGINE WORKSHOP 3 //
// ************************************************************************* //


// ----- IDENTIFY THE DATA -----

// time-series data on human populations & night lights is available
// "time-series" means there are repeated observations (i.e multiple data files)

// (1) GPWv411: Population Count (Gridded Population of the World Version 4.11)
var population = ee.ImageCollection("CIESIN/GPWv411/GPW_Population_Count");
print('GPWv411', population);

// Pull out only the images for years we want (2000-2015)
// import two images for start and end
var population_2000 = 
  ee.Image("CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2000_30_sec");
var population_2015 = 
  ee.Image("CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2015_30_sec");
print('2000 Population:', population_2000);
print('2015 Population:', population_2015);

// Visualise the images - create a colour ramp
var population_vis = {
  max: 1000.0,
  palette: ['ffffe7', '86a192', '509791', '307296', '2c4484', '000066'],
  min: 0.0
}
Map.addLayer(population_2000, population_vis, 'Pop. Count 2000');
Map.addLayer(population_2015, population_vis, 'Pop. Count 2015');


/* (2) DMSP OLS: Nighttime Lights Time Series Version 4, Defense Meteorological Program 
Operational Linescan System */
var nl = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS");
print("Nightlights:", nl);

// Pull images we want (2000-2013)
var nl_2000 = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F142000");
var nl_2013 = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182013");
print('Nightlights 2000 processed:', nl_2000);
print('Nightlights 2013 processed:', nl_2013);

// There are 4 bands per image - only need 1 for our analysis ('avg_vis' or 'stable_lights')
var nl_2000 = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F142000").select(['avg_vis'],
  ['nightlight']); // select & rename
var nl_2013 = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182013").select(['avg_vis'],
  ['nightlight']); // select & rename
  
// Create nightlight colour ramp
var nighttimeLightsVis = {
  max: 63.0,
  palette: ['black', '#65FE42'],
  min: 0.0
};
  
Map.addLayer(nl_2000, nighttimeLightsVis, 'Nighttime Lights 2000');
Map.addLayer(nl_2013, nighttimeLightsVis, 'Nighttime Lights 2013');


// ----- **DEFINE A CUSTOM GRID (analysis units) ** -----
var spacing = 5;  // degrees

var lonLat = ee.Image.pixelLonLat();  // Create image with Lon & Lat 

var lonIndex = lonLat.select('longitude')  // Create grid indices
  .divide(spacing)
  .floor();
var latIndex = lonLat.select('latitude')
  .divide(spacing)
  .floor();
  
var gridID = lonIndex.add(latIndex.multiply(1000)).rename('gridID').toInt();
  // Combine indices into a single unique ID

var worldGrid = gridID.reduceToVectors({
  geometry: ee.Geometry.Polygon(
    [[[-180, 85], [180, 85], [180, -85], [-180, -85]]],
    null,
    false
  ),
  scale: 111319 * spacing,  // Approximate scale at the equator in meters
  geometryType: 'polygon',
  eightConnected: false,
  reducer: ee.Reducer.countEvery(),
  maxPixels: 1e9
});  // Reduce to vectors over the entire world to create the polygons

Map.setCenter(0, 0, 2);  // Center the map and display my custom world grid
Map.addLayer(worldGrid, {color: 'purple'}, '5-Degree World Grid', false);


// Import coastline
var coast = ee.FeatureCollection('projects/UQ_intertidal/dataMasks/naturalEarthCoastline_v1');
Map.addLayer(coast, {color: 'white'}, 'Coastlines');

// Coastline grid
//var coastGrid = worldGrid.filter(ee.Filter.bounds(coast));
//Map.addLayer(coastGrid, {color: 'green'}, 'Coast Grid');



// ----- PREPARE FOR GLOBAL ANALYSIS -----

// At first, limit the size of the analysis to test whether my workflow is working

// Draw a small box on the map using geometry tools - can be hidden under 'Geometry Imports' tab

// Filter ecoregions to bounds
var coastGrid = worldGrid
  .filter(ee.Filter.bounds(coast))
  .filter(ee.Filter.bounds(geometry));
Map.addLayer(coastGrid, {color: 'blue'}, 'Coastal ecoregions', false);



// ----- CALCULATE GLOBAL POP. CHANGE IN RECTANGLE -----

// subtract 'historical' pixel values from 'recent' pixel values to obtain change in population

// Population change
var pop_change = population_2015
  .subtract(population_2000)
  .clip(coastGrid);
Map.addLayer(pop_change, {palette:  ['red', 'black', 'lime'], min: -500, max: 500}, 
  'Pop. change', false, 0.9);

// Nightlight change
var nl_change = nl_2013
  .subtract(nl_2000)
  .clip(coastGrid);
Map.addLayer(nl_change, {palette:  ['red', 'black', 'lime'], min: -50, max: 50}, 
  'Nightlight change', false, 0.9);

// average change in nightlights per ecoregion
var nl_changePerEcoregion = nl_change.reduceRegions({
  collection: coastGrid, 
  reducer: ee.Reducer.mean(), 
  scale: 1000,  // note computing at a larger scale for speed
});
print('nl change Per Ecoregion (first)', nl_changePerEcoregion.first());
  // look at properties of the first one

// average change in population per ecoregion
var pop_changePerEcoregion = pop_change.reduceRegions({
  collection: coastGrid,
  reducer: ee.Reducer.mean(),
  scale: 1000
});
print('pop change per ecoregion (first)', pop_changePerEcoregion.first());



// ----- SCALE THE ANALYSIS -----

// No longer filtering to the bounds of the geometry shape!

var coast_ecoregions_global = worldGrid
  .filter(ee.Filter.bounds(coast));
Map.addLayer(coast_ecoregions_global, {color: 'firebrick'}, 'Coastal ecoregions');

var pop_change_global = population_2015
  .subtract(population_2000)
  .clip(coast_ecoregions_global);
Map.addLayer(pop_change_global, {palette:  ['darkred', 'black', 'lime'], min: -500, max: 500}, 
  'Global Pop. change', true, 0.9);

var nl_change_global = nl_2013
  .subtract(nl_2000)
  .clip(coast_ecoregions_global);
Map.addLayer(nl_change_global, {palette:  ['darkred', 'black', 'lime'], min: -50, max: 50}, 
  'Global Nightlight change', true, 0.9);

var nl_changePerEcoregion_global = nl_change.reduceRegions({
  collection: coastGrid, 
  reducer: ee.Reducer.mean(), 
  scale: 1000, // note computing at a larger scale for speed
});

var pop_changePerEcoregion_global = pop_change.reduceRegions({
  collection: coastGrid,
  reducer: ee.Reducer.mean(),
  scale: 1000
});

// Export our results so Earth Engine runs in batch mode
/* Export.table.toAsset({
  collection: pop_changePerEcoregion, //
  description: 'export_pop_global_toAsset',
  assetId:'pop_changePerEcoregion_global'
}); 
Export.table.toAsset({
  collection: nl_changePerEcoregion, //
  description: 'export_nl_global_toAsset',
  assetId:'nl_changePerEcoregion_global'
}); */
// both these assets will appear under "Tasks" tab - click RUN


// Visualise data
var pop_result = ee.FeatureCollection("projects/mb5370-module5/assets/pop_changePerEcoregion_global");
Map.addLayer(pop_result, {color: 'white'}, 'pop_result', false);
print('pop_result_global', pop_result.sort('mean')); // sort by mean in descending order

var nl_result = ee.FeatureCollection("projects/mb5370-module5/assets/nl_changePerEcoregion_global");
Map.addLayer(nl_result, {color: 'blue'}, 'nl_result', false);
print('nl_result_global', nl_result.sort('mean'));

// Visualise result
var empty = ee.Image().byte() // make an empty image
var palette = ['green','yellow', 'orange', 'red'];
var popChangePerEcoregion = empty.paint({
  featureCollection: pop_result,
  color:'mean'
});

Map.addLayer(popChangePerEcoregion, {max:112, palette: palette}, 'popChange_result');