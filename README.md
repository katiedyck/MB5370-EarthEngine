# MB5370 Module 4: Google Earth Engine

This repository documents four computer workshops from the JCU MB5370 Google Earth Engine module, which focused on cloud-based geospatial computing using Google Earth Engine (GEE), JavaScript fundamentals, the Earth Engine API, and two applied global-scale marine spatial analyses.

## Module Overview
Across four computer workshops, this module covered:
- Writing and running JavaScript in the Earth Engine Code Editor
- Understanding Earth Engine's core data structures (`Image`, `Feature`, `ImageCollection`, `FeatureCollection`)
- Filtering, reducing, and mapping functions over large spatial datasets
- Importing external vector/raster data and exporting results (Asset / Drive)
- Scaling an analysis from a small test region to the full global domain

| Workshop | Topic | Summary |
| :---- | : ---- | :---- |
| 1 | Introduction to Google Earth Engine | Introduction to the Earth Engine's Code Editor, JavaScript basics (variables, lists, objects, functions), saving scripts under Git-based version control, navigating the Earth Engine Docs, and visualising Image and Feature data (elevation via SRTM, protected areas via WDPA). |
| 2 | Filters and Computation | Metadata and spatial filtering of `FeatureCollection`s (e.g. isolating national parks within New Zealand), chaining filter operations, image computation (`.add()`, `.gt()`, `.selfMask()`), region reducers (`reduceRegion` for mean/min/max/area statistics), and image reducers for compositing image collections (e.g. cloud-free Landsat composites via `.median()`). |
| 3 | Nightlights in Global Coastlines | A global change-detection analysis comparing population (GPWv4.11) and nighttime lights (DMSP-OLS) between two time points, filtered to coastal ecoregions/grid cells, with per-region change statistics computed via `reduceRegions()`, scaled from a small test area to a full global export scale. |
| 4 | Allen Coral Atlas research station analysis | Digitising research station locations as a `FeatureCollection`, importing Allen Coral Atlas benthic cover [data], isolating and masking the coral/algae class, buffering stations to a snorkelling-accessible distance, and using .map() to compute coral area within each buffer at scale — identifying the best-supported research station for shore-based coral fieldwork. |
-----

JavaScript files (`.js`) from each workshop are saved in their own folder. Workshops 1 and 2 are divided into multiple files and numbered appropriately to indicate the correct order of workshop procedures.
