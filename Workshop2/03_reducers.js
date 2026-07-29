// *************************************************** //
// EARTH ENGINE WORKSHOP 2 - Part 3 //
// *************************************************** //

// ***** Region Reducers *****

// "Reducer" is an object that represents a way of aggregating data or computing a statistic.
// (Similar to Zonal Statistics in ArcGIS.)

/* For Mt Taranaki, we need to work out a few elements:
  (1) calculate average slope (mean value of all pixel values) of the national park
  (2) calulate max and min elevation of the park
  (3) work out how much area > 1500m occurs inside the park */

var protected_areas = ee.FeatureCollection("WCMC/WDPA/current/polygons");
Map.setCenter(174.0638, -39.298, 10.5); // zoom to Mount Taranaki, New Zealand

var dataset = ee.Image("CGIAR/SRTM90_V4");
var elevGt1500 = dataset.gt(1500);
var terrain = ee.Terrain.products(dataset);
var slope = terrain.select(['slope']);
var hillshade = terrain.select(['hillshade']);

// Find Taranaki NP
var taranaki = protected_areas.filter(ee.Filter.eq('NAME', 'Egmont National Park'));
Map.addLayer(taranaki, {color: 'orange'}, 'Mt Taranaki');

// Apply a spatial reducer to estimate mean slope
var slopeOutput = slope.reduceRegion(
  {reducer: ee.Reducer.mean(), // calculate mean of all slope pixel values in the park
  geometry: taranaki,
  scale: 90 // pixel size in meters - from metadata, in 'bands' tab
});
print('slopeOutput', slopeOutput);

// Try clipping to see if it's any different
var taranakiSlope = slope.clip(taranaki);
Map.addLayer(taranakiSlope, {palette: ["white", "darkred", "black"], min:0, max:45}, 'taranaki slope');

var slopeOutput2 = taranakiSlope.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: taranaki,
  scale:90
});
print("slopeOutput2", slopeOutput2);

// Use reduce regions with a different reducer (Max)
var elevOutput_Max = dataset.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: taranaki,
  scale:90
})
print("elevOutput_Max", elevOutput_Max);

// Use reduce regions with a different reducer (Min)
var elevOutput_Min = dataset.reduceRegion({
  reducer: ee.Reducer.min(),
  geometry: taranaki,
  scale:90
})
print("elevOutput_Min", elevOutput_Min);

// Use reduce regions with a different reducer (MinMax)
var elevOutput_MinMax = dataset.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: taranaki,
  scale:90
})
print("elevOutput_MinMax", elevOutput_MinMax);

/* To find the area of the park > 1500m elevation, we need to first make an image where each pixel
is a binary value indicating that it's above 1500m. After that, convert those to the area of each pixel,
which if we sum together, represents the area of the mountain above 1500m. We sum them using a reduce
region to make sure we're only computing the area INSIDE the national park. 

Default scale in Earth Engine is meters. To turn result to km2 value we need to swap types ('get' the
value from the object properties, covert it to an ee.Number, and then divide to get km2. */

// Get area of > 1500m
var areaGt1500m = elevGt1500 // binary 1 == yes
  .multiply(ee.Image.pixelArea()) // get area of each pixel
  .reduceRegion({
    reducer: ee.Reducer.sum(), // sum all pixel areas together
    geometry: taranaki,
    scale: 90
  });
print('The area of Taranaki above 1500m (m2):', areaGt1500m)
print('The area of Taranaki above 1500m (km2):', ee.Number(areaGt1500m.get('elevation')).divide(1000*1000));

//
// ***** Image Reducers *****

/* With images, take each pixel value over many layers (bands or overlapping images) and summarise their
value to a single new value. */

/* Use WORLDCLIM data to demonstrate how to get an annual average temperature from many months of temperature
data. WORLDCLIM data underpins most species distribution models, which are spatial models that try to make an
estimate of where a given species is likely to be found. Think about a frog, we know it lives in a certain
climate envelope, so if we include climate in our model we can better predict where they will occur. 

In the image collection we have 12 images, one representing the temperature for each month. */

var dataset = ee.ImageCollection('WORLDCLIM/V1/MONTHLY');
print(dataset) // 12 images where each one is a month

// Get two months
var jan_climate = ee.Image("WORLDCLIM/V1/MONTHLY/01")
var july_climate = ee.Image("WORLDCLIM/V1/MONTHLY/07")


// Select their average temperature bands
var jan_climate_avg = jan_climate.select('tavg') // get average band
var july_climate_avg = july_climate.select('tavg')
print("jan_climate_avg", jan_climate_avg);
print("july_climate_avg", july_climate_avg);


// Set vis parameters
var meanTemperatureVis = {
  min: -40,
  max: 30,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red'],
};

Map.addLayer(jan_climate_avg, meanTemperatureVis, 'janClimate')
Map.addLayer(july_climate_avg, meanTemperatureVis, 'julyClimate')

// Note the pixel scaling error...Need to divide all pixel values by 10, or multiply by .1 (.multiply(0.1))

// To support the frog SDM we need an annual average...reduce those 12 pixel values into a single average value.

// We want to reduce to get the yearly average
var annualMeanTemperature = dataset
  .select('tavg')
  .mean() // this is the reducer
  .multiply(0.1); // scale pixels to real values

Map.setCenter(71.7, 52.4, 3);
Map.addLayer(annualMeanTemperature, meanTemperatureVis, 'Mean Annual Temperature');

// Problem of clouds
var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2017-01-01', '2017-12-31'); // only images from 2017
var trueColour = dataset.select(['B4', 'B3', 'B2']);
var trueColourVis = {
  min: 0.0,
  max: 0.4,
};
Map.setCenter(146.746, -19.529, 9);
Map.addLayer(trueColour, trueColourVis, 'True Colour Landsat');

/* Using image reducers, we can filter through all pixels and pull out summary statistics. To get those
summary statistics we use a reducer. 
In code directly below, .median() reducer is used to find the median pixel in all the images from dataset. */

var LandsatMedian = trueColour.median();
Map.addLayer(LandsatMedian, trueColourVis, 'True Color Median');