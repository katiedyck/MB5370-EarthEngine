// *************************************************** //
// EARTH ENGINE WORKSHOP 2 - Part 1 //
// *************************************************** //

// *** Filtering Collections ***

Map.setCenter(174.0638, -39.298, 11); // zoom to Mount Taranaki, New Zealand
var dataset = ee.Image("CGIAR/SRTM90_V4");
print(dataset);

Map.addLayer(dataset);

var elevationVis = {
  min: 0,
  max: 2500,
  palette: ['0000ff', '00ffff', 'ffff00', 'ff0000', 'ffffff']
};
Map.addLayer(dataset, elevationVis, 'Elevation');

// Add the protected planet data
var protected_areas = ee.FeatureCollection("WCMC/WDPA/current/polygons");
print(protected_areas);
Map.addLayer(protected_areas, {color: 'green'}, 'Protected Areas');

// How many areas are in the feature collection?
print("No. of protected areas:", protected_areas.size())

print("First PA:", protected_areas.first()) // looking at just the first feature is much faster
print("First 5 PAs:", protected_areas.limit(5)) // looking at first 5 features

// Filter only level II protected areas
var iucn_pa = protected_areas.filter(ee.Filter.eq("IUCN_CAT", "II"));
Map.addLayer(iucn_pa, {color: "yellow"}, "National Parks", false); // hide layer automatically
print("No. category II protected areas:", iucn_pa.size());

// ...What did protected areas look like in 1980 vs today?
// filter date
var iucn_pre1980 = protected_areas.filter(ee.Filter.lte("STATUS_YR", 1980));
Map.addLayer(iucn_pre1980, {color: "white"}, "PAs in 1980")
print("No. pre 1980 protected areas:", iucn_pre1980.size());

//
// *** Spatial Filters ***

// filter only protected areas in NZ using a spatial filter
// need to import a country dataset from data catalogue
var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");
print(countries);
Map.addLayer(countries, null, "countries", false); // hide layer automatically

// New Zealand only
var nz = countries.filter(ee.Filter.equals("country_na", "New Zealand"));
print(nz);
Map.addLayer(nz, {color: 'red'}, "New Zealand", false); // hide layer automatically
// now we have a feature collection with only 1 feature, New Zealand

// Spatial filter PA's only in NZ
var nz_pas = protected_areas.filter(ee.Filter.bounds(nz));
print("Number of PA's in NZ:", nz_pas.size());
Map.addLayer(nz_pas, {color: "C68FEB"}, "NZ PAs only");

// Link everything into one statement
var nz_national_parks = protected_areas.filter(ee.Filter.eq("IUCN_CAT", "II")).filter(ee.Filter.bounds(nz));
print("No. of National Parks in NZ:", nz_national_parks.size());