# MB5370 Module 4: Google Earth Engine

This repository documents four computer workshops from the JCU MB5370 Google Earth Engine module, which focused on cloud-based geospatial computing using Google Earth Engine (GEE), JavaScript fundamentals, the Earth Engine API, and two applied global-scale marine spatial analyses.

  [Get Started with Google Earth Engine](https://developers.google.com/earth-engine/guides/getstarted)

## Module Overview
Across four computer workshops, this module covered:
- Writing and running JavaScript in the Earth Engine Code Editor
- Understanding Earth Engine's core data structures (`Image`, `Feature`, `ImageCollection`, `FeatureCollection`)
- Filtering, reducing, and mapping functions over large spatial datasets
- Importing external vector/raster data and exporting results (Asset / Drive)
- Scaling an analysis from a small test region to the full global domain

| Workshop | Topic | Summary |
| :---- | :---- | :---- |
| 1 | Introduction to Google Earth Engine | Introduction to the Earth Engine's Code Editor, JavaScript basics (variables, lists, objects, functions), saving scripts under Git-based version control, navigating the Earth Engine Docs, and visualising Image and Feature data (elevation via SRTM, protected areas via WDPA). |
| 2 | Filters and Computation | Metadata and spatial filtering of `FeatureCollection`s (e.g. isolating national parks within New Zealand), chaining filter operations, image computation (`.add()`, `.gt()`, `.selfMask()`), region reducers (`reduceRegion` for mean/min/max/area statistics), and image reducers for compositing image collections (e.g. cloud-free Landsat composites via `.median()`). |
| 3 | Nightlights in Global Coastlines | A global change-detection analysis comparing population (GPWv4.11) and nighttime lights (DMSP-OLS) between two time points, filtered to coastal ecoregions/grid cells, with per-region change statistics computed via `reduceRegions()`, scaled from a small test area to a full global export scale. |
| 4 | Allen Coral Atlas research station analysis | Digitising research station locations as a `FeatureCollection`, importing Allen Coral Atlas benthic cover [data], isolating and masking the coral/algae class, buffering stations to a snorkelling-accessible distance, and using .map() to compute coral area within each buffer at scale — identifying the best-supported research station for shore-based coral fieldwork. |
--------------------------------

JavaScript files (`.js`) from each workshop are saved in their own folder. Workshops 1 and 2 are divided into multiple files and numbered appropriately to indicate the correct order of workshop procedures.

## Earth Engine Data
Datasets from the [Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets) used in this module:
- [SRTM Digital Elevation Data Version 4](https://developers.google.com/earth-engine/datasets/catalog/CGIAR_SRTM90_V4)
- [WDPA: World Database on Protected Areas (polygons)](https://developers.google.com/earth-engine/datasets/catalog/WCMC_WDPA_current_polygons)
- [Greenland DEM - Greenland Mapping Project (GIMP)](https://developers.google.com/earth-engine/datasets/catalog/OSU_GIMP_DEM)
- [LSIB 2017: Large Scale International Boundary Polygons, Simplified](https://developers.google.com/earth-engine/datasets/catalog/USDOS_LSIB_SIMPLE_2017)
- [WorldClim Climatology V1](https://developers.google.com/earth-engine/datasets/catalog/WORLDCLIM_V1_MONTHLY)
- [USGS Landsat 8 Collection 2 Tier 1 TOA Reflectance](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_TOA)
- [ETOPO1: Global 1 Arc-Minute Elevation](https://developers.google.com/earth-engine/datasets/catalog/NOAA_NGDC_ETOPO1)
- [GPWv411: Population Count (Gridded Population of the World Version 4.11)](https://developers.google.com/earth-engine/datasets/catalog/CIESIN_GPWv411_GPW_Population_Count)
- [DMSP OLS: Nighttime Lights Time Series Version 4, Defense Meteorological Program Operational Linescan System](https://developers.google.com/earth-engine/datasets/catalog/NOAA_DMSP-OLS_NIGHTTIME_LIGHTS)
- [Allen Coral Atlas (ACA) - Geomorphic Zonation and Benthic Habitat - v2.0](https://developers.google.com/earth-engine/datasets/catalog/ACA_reef_habitat_v2_0)
