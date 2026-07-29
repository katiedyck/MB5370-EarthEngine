// *************************************************** //
// EARTH ENGINE WORKSHOP 2 - Part 2 //
// *************************************************** //

// *** COMPUTATION IN EARTH ENGINE

/* E.g. We discover there is a problem with the radar instrument on board the space shuttle when it 
rolled over on its back and began imaging the Earth. It resulted in a consistent error, where the actual
height of the topographical features on Earth it collected was always underestimated by 100m.
We can fix a data error like this by adding a 100m constant to the data. */

Map.setCenter(174.0638, -39.298, 11); // zoom to Mount Taranaki, New Zealand
Map.setOptions("SATELLITE");

var dataset = ee.Image("CGIAR/SRTM90_V4");
var elevationVis = {
  min: 0,
  max: 2500,
  palette: ['0000ff', '00ffff', 'ffff00', 'ff0000', 'ffffff']
};
Map.addLayer(dataset, elevationVis, 'Elevation', false); // hide layer automatically

var protected_areas = ee.FeatureCollection("WCMC/WDPA/current/polygons");
Map.addLayer(protected_areas, {color: 'green'}, 'Protected Areas', false);

var iucn_pa = protected_areas.filter(ee.Filter.eq("IUCN_CAT", "II"));
Map.addLayer(iucn_pa, {color: "yellow"}, "National Parks", false);

var iucn_pre1980 = protected_areas.filter(ee.Filter.lte("STATUS_YR", 1980));
Map.addLayer(iucn_pre1980, {color: "white"}, "PAs in 1980", false);

var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");
Map.addLayer(countries, null, "countries", false);

var nz = countries.filter(ee.Filter.equals("country_na", "New Zealand"));
Map.addLayer(nz, {color: 'red'}, "New Zealand", false);

var nz_pas = protected_areas.filter(ee.Filter.bounds(nz));
Map.addLayer(nz_pas, {color: "C68FEB"}, "NZ PAs only", false);

// Change opacity
Map.addLayer(dataset, elevationVis, "Elevation", true, 0.6); // 60% opacity
print(dataset);

// click on a pixel to view the elevation under 'Inspector' tab

// Computation - add a constant to entire STRM dataset
var strm_fixed = dataset.add(100);
Map.addLayer(strm_fixed, elevationVis, "fixed strm");
print(strm_fixed);

//
// ***** Thresholding Images *****

// Find pixels with a value greater than 1500
var elevGt1500 = dataset.gt(1500);
Map.addLayer(elevGt1500) // Binary white == true
print(elevGt1500);

/* We can mask out the places < 1500m in elevation (= 0, black spaces) so no other operations
can be applied to them. */
var elevGt1500 = dataset.gt(1500).selfMask();
Map.addLayer(elevGt1500);

Map.addLayer(elevGt1500.selfMask(), {palette: 'fuchsia'}, 'gt 1500m', true, 0.7);

//
// ***** Complex Image Functions *****

// apply complex algorithm
// Use terrain, an algorithm that returns several topographical variables from an elevation image
var terrain = ee.Terrain.products(dataset);
print('terrain', terrain);

// make images from bands we're interested in
var slope = terrain.select(['slope']);
var hillshade = terrain.select(['hillshade']);
Map.addLayer(hillshade, null, 'hillshade');
Map.addLayer(slope, {palette: ['white', 'darkred', 'black'], min: 0, max: 45}, 'slope');

print('slope', slope);
print('hillshade', hillshade);