
"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { saveAs } from 'file-saver';
//import mapshaper from 'mapshaper'; // Ensure mapshaper is installed
import { GeoJsonObject } from 'geojson';

// ------------------  ----------------------------- -----------------
// ------------------ Extract file name  ------------------

// Helper function to extract the file name from a URL or return the original name
const extractDatasetName = (name: string): string => {
  try {
    // Attempt to create a URL object
    const url = new URL(name);
    // Get the pathname (e.g., "/mapbox-gl-js/assets/ne_50m_urban_areas.geojson")
    const pathname = url.pathname;
    // Extract the last segment after the final slash
    const lastSegment = pathname.split("/").pop() || "";
    // Remove the file extension using a regular expression
    return lastSegment.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error extracting dataset name:", error);
    // If an error occurs, it's likely not a valid URL
    // Return the original name (or process it differently if needed)
    return name;
  }
};
// ------------------  ----------------------------- -----------------
// ------------------ Custom Search Control (Fixed) ------------------

// Download all datasets as a single GeoJSON file
export const downloadAsGeoJSON = (geoJSONDataList: GeoJsonObject[]) => {
    if (!geoJSONDataList.length) return;
  
    const mergedGeoJSON = {
      type: 'FeatureCollection',
      features: geoJSONDataList.flatMap((data: GeoJsonObject) => (data as GeoJSON.FeatureCollection).features || []),
    };
  
    const blob = new Blob([JSON.stringify(mergedGeoJSON, null, 2)], { type: 'application/json' });
    saveAs(blob, 'datasets.geojson');
  };
  
  // Convert and download as Shapefile
  /* export const downloadAsShapefile = async (geoJSONDataList: GeoJsonObject[]) => {
    if (!geoJSONDataList.length) return;
  
    const geoJSONString = JSON.stringify({
      type: 'FeatureCollection',
      features: geoJSONDataList.flatMap((data: GeoJsonObject) => (data as GeoJSON.FeatureCollection).features || []),
    });
  
     try {
      const shapefileData = await mapshaper.applyCommands('-i input.geojson -o format=shapefile', {
        'input.geojson': geoJSONString,
      }); 

      const zipBlob = new Blob([shapefileData['input.zip']], { type: 'application/zip' });
      saveAs(zipBlob, 'datasets.zip');
    } catch (error) {
      console.error('Error converting to Shapefile:', error);
    } 
  }; */
  
// ------------------ Custom Search Control (Fixed) ------------------
const SearchControl: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        const searchContainer = L.DomUtil.create("div", "leaflet-bar");
        searchContainer.style.padding = "2px";
        searchContainer.style.background = "white";
        searchContainer.style.borderRadius = "2px";
        searchContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

        const searchInput = L.DomUtil.create("input", "leaflet-search-input", searchContainer);
        searchInput.type = "text";
        searchInput.placeholder = "Search location...";
        searchInput.style.width = "200px";
        searchInput.style.border = "none";
        searchInput.style.outline = "none";
        searchInput.style.padding = "4px";

        const CustomSearchControl = L.Control.extend({
            onAdd: function () {
                return searchContainer;
            },
            onRemove: function () {
            }
        });

        const searchControl = new CustomSearchControl({ position: "topright" });
        searchControl.addTo(map);

        searchInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                const query = searchInput.value.trim();
                if (!query) return;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                    );
                    const data = await response.json();

                    if (data.length > 0) {
                        //const { lat, lon, display_name } = data[0];
                        const { lat, lon} = data[0];
                        const latlng = L.latLng(parseFloat(lat), parseFloat(lon));

                        // Center map on the searched location without zooming
                        map.setView(latlng, map.getZoom());
                        //L.marker(latlng).addTo(map).bindPopup(display_name).openPopup();
                    } else {
                        alert("No results found.");
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                }
            }
        });

        return () => {
            map.removeControl(searchControl);
        };
    }, [map]);

    return null;
};

export default SearchControl;
// ------------------  ----------------------------- -----------------
