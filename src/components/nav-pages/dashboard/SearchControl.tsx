"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { saveAs } from "file-saver";
import { GeoJsonObject } from "geojson";

// ---------------------- GeoJSON Download Utility ----------------------

export const downloadAsGeoJSON = (geoJSONDataList: GeoJsonObject[]) => {
  if (!geoJSONDataList.length) return;

  const mergedGeoJSON = {
    type: "FeatureCollection",
    features: geoJSONDataList.flatMap(
      (data: GeoJsonObject) =>
        (data as GeoJSON.FeatureCollection).features || []
    ),
  };

  const blob = new Blob([JSON.stringify(mergedGeoJSON, null, 2)], {
    type: "application/json",
  });

  saveAs(blob, "datasets.geojson");
};

// ---------------------- Search Control Component ----------------------

const SearchControl: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const searchContainer = L.DomUtil.create("div", "leaflet-bar");
    Object.assign(searchContainer.style, {
      padding: "2px",
      background: "white",
      borderRadius: "2px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    });

    const searchInput = L.DomUtil.create(
      "input",
      "leaflet-search-input",
      searchContainer
    ) as HTMLInputElement;

    Object.assign(searchInput, {
      type: "text",
      placeholder: "Search location...",
    });

    Object.assign(searchInput.style, {
      width: "200px",
      border: "none",
      outline: "none",
      padding: "4px",
    });

    const CustomSearchControl = L.Control.extend({
      onAdd: () => searchContainer,
      onRemove: () => {},
    });

    const searchControl = new CustomSearchControl({ position: "topleft" });
    searchControl.addTo(map);

    searchInput.addEventListener("keydown", async (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;

      const query = searchInput.value.trim();
      if (!query) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
          map.setView(latlng, map.getZoom());
        } else {
          alert("No results found.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

export default SearchControl;
