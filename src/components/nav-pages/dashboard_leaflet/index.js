"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, ImageOverlay, GeoJSON, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      position: "topright",
      searchLabel: "Enter address...",
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

export default function DashboardMap() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedGeoJSONs, setUploadedGeoJSONs] = useState([]); // State for GeoJSON files
  const [mapCenter, setMapCenter] = useState([52.520008, 13.404954]);

  const handleImageUpload = (images) => {
    const updatedImages = images.map((image) => ({
      ...image,
      visible: true,
    }));

    setUploadedImages((prev) => [...prev, ...updatedImages]);

    if (updatedImages.length > 0) {
      const firstImageBounds = updatedImages[0].bounds;
      const centerLat = (firstImageBounds[0][0] + firstImageBounds[1][0]) / 2;
      const centerLng = (firstImageBounds[0][1] + firstImageBounds[1][1]) / 2;
      setMapCenter([centerLat, centerLng]);
    }
  };

  const handleGeoJSONUpload = (geojson) => {
    setUploadedGeoJSONs((prev) => [...prev, { ...geojson, visible: true }]); // Default visibility is true
  };

  const handleToggleImage = (imageName) => {
    setUploadedImages((prev) =>
      prev.map((image) =>
        image.name === imageName ? { ...image, visible: !image.visible } : image
      )
    );
  };

  const handleToggleGeoJSON = (geojsonName) => {
    setUploadedGeoJSONs((prev) =>
      prev.map((geojson) =>
        geojson.name === geojsonName ? { ...geojson, visible: !geojson.visible } : geojson
      )
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-12"} transition-all duration-300 flex flex-col border-r`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="self-end m-2">
          {sidebarOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
        </button>
        {sidebarOpen && (
          <SidebarItems
            onImageUpload={handleImageUpload}
            onGeoJSONUpload={handleGeoJSONUpload}
            onToggleImage={handleToggleImage}
            onToggleGeoJSON={handleToggleGeoJSON}
            uploadedImages={uploadedImages}
            uploadedGeoJSONs={uploadedGeoJSONs}
          />
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <SearchControl />

          {/* Render uploaded images as overlays */}
          {uploadedImages
            .filter((image) => image.visible)
            .map((image, index) => (
              <ImageOverlay
                key={index}
                url={image.url}
                bounds={image.bounds}
                opacity={1.0}
              />
            ))}

          {/* Render uploaded GeoJSON files */}
          {uploadedGeoJSONs
            .filter((geojson) => geojson.visible)
            .map((geojson, index) => (
              <GeoJSON
                key={index}
                data={geojson.data}
                style={{ color: "blue", weight: 2, opacity: 0.65 }}
              />
            ))}
        </MapContainer>
      </div>
    </div>
  );
}