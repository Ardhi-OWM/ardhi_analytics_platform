"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Cluster from "react-leaflet-cluster";
import { useMap } from "react-leaflet";
import { GeoJsonObject } from "geojson";

import { mapLayers } from "@/components/constants";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const SearchControl = dynamic(
  () => import("@/components/nav-pages/dashboard/SearchControl"),
  { ssr: false }
);
const MapBounds = dynamic(
  () => import("@/components/nav-pages/dashboard/MapBounds"),
  { ssr: false }
);

interface MapProps {
  geoJSONDataList?: GeoJsonObject[];
}

interface GeoTIFFOverlayProps {
  geoTIFFOverlay: L.ImageOverlay | null;
}

const GeoTIFFOverlay: React.FC<GeoTIFFOverlayProps> = ({ geoTIFFOverlay }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoTIFFOverlay) return;

    geoTIFFOverlay.addTo(map);
    map.fitBounds(geoTIFFOverlay.getBounds());

    return () => {
      geoTIFFOverlay.remove();
    };
  }, [geoTIFFOverlay, map]);

  return null;
};

const DashboardMap: React.FC<MapProps> = () => {
  const [geoJSONDataList, setGeoJSONDataList] = useState<GeoJsonObject[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(
    mapLayers.find((layer) => layer.default)?.url || mapLayers[0].url
  );
  const [geoTIFFOverlay, setGeoTIFFOverlay] = useState<L.ImageOverlay | null>(
    null
  );
  const [selectedProperties, setSelectedProperties] = useState<
    Record<string, string | number | boolean> | null
  >(null);

  const handleRemoveImage = () => setGeoTIFFOverlay(null);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden w-full">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 flex flex-col border-r border-gray-200/[0.25] z-50 ${
          sidebarOpen ? "w-64" : "min-w-12"
        }`}
      >
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="self-end m-2"
        >
          {sidebarOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
        </IconButton>

        {sidebarOpen && (
          <Box className="mt-2">
            <SidebarItems
              geoJSONDataList={geoJSONDataList}
              setGeoJSONDataList={setGeoJSONDataList}
              setGeoTIFFOverlay={setGeoTIFFOverlay}
              onRemoveImage={handleRemoveImage}
            />
          </Box>
        )}
      </div>

      {/* Map Area */}
      <div className="relative flex-grow h-full">
        <MapContainer
          center={[52.520008, 13.404954]}
          zoom={13}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
          className="w-full h-full"
        >
          <MapBounds geoJSONDataList={geoJSONDataList} />
          <SearchControl />
          <TileLayer key={activeLayer} url={activeLayer} />
          <GeoTIFFOverlay geoTIFFOverlay={geoTIFFOverlay} />

          <Cluster zoomToBoundsOnClick={false}>
            {geoJSONDataList.map((geoJSONData, index) => (
              <GeoJSON
                key={index}
                data={geoJSONData}
                pointToLayer={(_, latlng) =>
                  L.marker(latlng, {
                    icon: L.divIcon({
                      className: "icon-cluster",
                      html: `<div style="
                        background-color: #ccccff;
                        border: 1px solid #0000ff;
                        border-radius: 50%;
                        width: 10px;
                        height: 10px;
                        opacity: 0.8;
                      "></div>`,
                      iconSize: [10, 10],
                      iconAnchor: [7, 7],
                    }),
                  })
                }
                onEachFeature={(feature, layer) => {
                  if (!feature?.properties) return;

                  const tooltipContent = Object.entries(feature.properties)
                    .map(
                      ([key, value]) =>
                        `<div style="margin-bottom:4px;"><strong>${key}:</strong> ${value}</div>`
                    )
                    .join("");

                  layer.bindTooltip(tooltipContent, {
                    direction: "top",
                    offset: [0, -10],
                    opacity: 0.9,
                    sticky: true,
                  });

                  layer.on("mouseover", () => layer.openTooltip());
                  layer.on("mouseout", () => layer.closeTooltip());
                  layer.on("click", () =>
                    setSelectedProperties(feature.properties)
                  );
                }}
              />
            ))}
          </Cluster>

          {/* Layer Selector */}
          <div className="absolute bottom-2 left-2 z-[1001]">
            <DropdownMenu onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <span className="flex items-center px-6 py-1 border border-purple-300 rounded-md cursor-pointer shadow-lg bg-background text-sm min-w-40">
                  {
                    mapLayers.find((layer) => layer.url === activeLayer)
                      ?.name || "Select Map Layer"
                  }
                  <span className="ml-2">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="border border-gray-300 rounded-lg shadow-md"
                style={{ zIndex: 1001 }}
              >
                {mapLayers.map((layer) => (
                  <DropdownMenuItem
                    key={layer.url}
                    onClick={() => setActiveLayer(layer.url)}
                    className={`cursor-pointer ${
                      activeLayer === layer.url
                        ? "bg-blue-500"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {layer.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </MapContainer>

        {/* Feature Details */}
        {selectedProperties && (
          <div className="absolute top-0 right-0 m-4 p-4 bg-white dark:bg-[hsl(279,100%,3.9%)] shadow-lg border rounded z-[1001] max-h-[calc(100vh-5rem)] overflow-y-auto">
            <h3 className="text-base font-bold underline underline-offset-1">
              Feature Details
            </h3>
            <ul>
              {Object.entries(selectedProperties).map(([key, value]) => (
                <li className="text-sm" key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
            <button
              className="text-sm border bg-blue-700 text-white px-3 py-1 rounded mt-2"
              onClick={() => setSelectedProperties(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMap;
