// ******************************************************************** //
// Earth Engine Workshop 2 Assignment: Mapping World's Deep Oceans //
// ******************************************************************** //


// --- PART 1: IMPORT THE DATA ---

var dataset = ee.Image('NOAA/NGDC/ETOPO1');
var elevation = dataset.select('bedrock');
var elevationVis = {
  min: -7000.0,
  max: 3000.0,
  palette: ['6A6E6E', 'afafaf', 'black', 'ccccc4', '3D3D3C'],
};
Map.setCenter(-37.62, 25.8, 2);
Map.addLayer(elevation, elevationVis, 'Elevation');

print('dataset', dataset);
print('elevation', elevation);



// --- PART 2: BUILD RASTER MAPS -----

// Hadal trenches and troughs (> 6000m)
var deep = dataset.select('bedrock').updateMask(elevation.lt(-6000));
// Map.centerObject(hadalTrenchTrough, 4);
Map.addLayer(deep, {palette: 'FA862F'}, 'Depth > 6000m');

// Abyssal plains (3000-6000m)
var abyssal = dataset.select('bedrock').updateMask(elevation.gte(-6000).and(elevation.lt(-3000)));
Map.addLayer(abyssal, {palette: '9771F0'}, 'Depth 3000-6000m');

// Continental and island slopes (250-3000m)
var slopes = dataset.select('bedrock').updateMask(elevation.gte(-3000).and(elevation.lt(-250)));
Map.addLayer(slopes, {palette: '168716'}, 'Depth 250-3000m');

// Submarine canyons (> 200m, slopes of >6 degrees)
var slope = ee.Terrain.slope(elevation); // calculate slope (in degrees)
var canyon = elevation.updateMask(elevation.lt(-200).and(slope.gt(6)));
Map.addLayer(canyon, {palette: 'cyan'}, 'Depth > 200m, Slope > 6 degrees');



// ----- PART 3: ADD VECTOR DATASET -----

// https://www.marineregions.org/gazetteer.php?p=details&id=63203
// .shp file imported

var highSeas = ee.FeatureCollection("projects/mb5370-module5/assets/highSeas");
// Map.addLayer(highSeas, {color: 'white'}, 'High Seas', true, 0.5);

var wdpa = ee.FeatureCollection("WCMC/WDPA/current/polygons");
var protected_areas = wdpa.filter(ee.Filter.gt("REP_M_AREA", 0)); // filter out 100% terrestrial protected areas
Map.addLayer(protected_areas, {color: 'yellow'}, 'Protected Areas', false);



// ----- PART 4: COMPUTE OVERLAP AND EXPORT AS ASSET -----

// Combine the four masks into a single binary image (1 = any feature present)
var combinedMask = deep.mask()
  .max(abyssal.mask())
  .max(slopes.mask())
  .max(canyon.mask())
  .selfMask();

// Simplify highSeas geometry to make spatial filtering 'cheaper'
var highSeasGeom = highSeas.geometry().simplify({maxError: 1000});

// Bounding-box pre-filter, then precise filter
var protected_areas_bbox = protected_areas.filterBounds(highSeasGeom.bounds());
var protected_areas_clipped = protected_areas_bbox.filterBounds(highSeasGeom);

// Reduce regions to flag overlap with combinedMask
var paWithOverlap = combinedMask.reduceRegions({
  collection: protected_areas_clipped,
  reducer: ee.Reducer.max(),
  scale: 2000,
  tileScale: 16
});
var overlappingPA = paWithOverlap.filter(ee.Filter.eq('max', 1));

// Export the result as an Earth Engine asset (NOT Map.addLayer — batch export has much higher memory limits)
Export.table.toAsset({
  collection: overlappingPA,
  description: 'export_overlapping_protected_areas',
  assetId: 'projects/mb5370-module5/assets/overlappingPA'  // adjust to your project path
});



// ----- PART 4b: LOAD EXPORTED ASSET AND DISPLAY -----
var overlappingPA = ee.FeatureCollection('projects/mb5370-module5/assets/overlappingPA');
print('Number of overlapping protected areas', overlappingPA.size());
Map.addLayer(overlappingPA, {color: 'yellow'}, 'Protected Areas', true, 0.5);



// ----- PART 5: LEGEND -----

// Create the legend panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Legend title
var legendTitle = ui.Label({
  value: 'Seafloor Zones',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 6px 0',
    padding: '0'
  }
});
legend.add(legendTitle);

// Helper function to create a color box + label row
var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 6px 4px 0',
      border: '1px solid black'
    }
  });

  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 0'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Define legend entries: [color, label]
var legendEntries = [
  ['#FA862F', 'Depth > 6000m (Deep)'],
  ['#9771F0', 'Depth 3000–6000m (Abyssal)'],
  ['#168716', 'Depth 250-3000m (Slopes)'],
  ['cyan', 'Depth > 200m, Slope > 6° (Canyon)'],
  ['#FFFF0099', 'Protected Areas']
];

// Add each row to the legend
legendEntries.forEach(function(entry) {
  legend.add(makeRow(entry[0], entry[1]));
});

// Add legend to the map
Map.add(legend);