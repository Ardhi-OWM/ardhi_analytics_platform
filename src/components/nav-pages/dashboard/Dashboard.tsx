"use client";

import React, { useState, useEffect } from "react";
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import { MapContainer, TileLayer, useMap,GeoJSON } from "react-leaflet";
import { GeoJsonObject } from 'geojson';

import { mapLayers } from "@/components/constants";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";

import SearchControl from "@/components/nav-pages/dashboard/db_functions";


interface MapProps {
    geoJSONDataList?: GeoJsonObject[];
}


// ------------------  Main DashboardMap Component (No map changes) ------------------
const DashboardMap: React.FC<MapProps> = () => { // Default to empty array

    const [geoJSONDataList, setGeoJSONDataList] = useState<GeoJsonObject[]>([]);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

    const MapBounds: React.FC = () => {
        const map = useMap();

        useEffect(() => {
            if (!geoJSONDataList.length || !map) return; // Ensure there is data

            const allBounds = geoJSONDataList
                .map((geoJSON) => {
                    const layer = L.geoJSON(geoJSON as GeoJsonObject);
                    return layer.getBounds();
                })
                .filter((bounds) => bounds.isValid());

            if (allBounds.length === 0) return;

            const mergedBounds = allBounds.reduce((acc, bounds) => acc.extend(bounds), allBounds[0]);

            if (mergedBounds.isValid()) {
                map.fitBounds(mergedBounds);
            }
        }, [geoJSONDataList, map]);

        return null;
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* ------------------------------ Sidebar ----------------------------*/}
            <div
                className={`${sidebarOpen ? "w-64" : "w-12"
                    } transition-all duration-300 flex flex-col z-50 border-r border-gray-200/[0.25]`}
            >
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} className="self-end m-2">
                    {sidebarOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
                </IconButton>

                {sidebarOpen && (
                    <Box className="mt-2">
                        <SidebarItems geoJSONDataList={geoJSONDataList} setGeoJSONDataList={setGeoJSONDataList} />
                    </Box>
                )}
            </div>

            {/* --------------------- Map Area (Leaflet) ------------------ */}
            <div className="map-container h-3/4">
                <div className="flex-grow">
                    <div style={{ height: "75vh", width: "100%" }}>
                        <MapContainer
                            center={[52.520008, 13.404954]}
                            zoom={13}
                            scrollWheelZoom={false}  // Keeps the map behavior unchanged
                            style={{ width: "100%", height: "100%" }}
                        >
                            {/*  Custom Search Control (Replaces GeoSearchControl) */}
                            <SearchControl />
                            {/*  Map Layer */}
                            <TileLayer key={activeLayer} url={activeLayer} />
                            {/* Prevents error by ensuring geoJSONDataList is always an array */}
                            {geoJSONDataList.map((geoJSONData, index) => (
                                <GeoJSON key={index} data={geoJSONData} />
                            ))}
                            <MapBounds />
                        </MapContainer>
                    </div>
                </div>

                {/* ---------------  Layer Selector & Dropdown ------------- */}
                <div className="absolute bottom-2 left-2 z-50"
                    style={{ zIndex: 1000 }} // Increase z-index explicitly
                >
                    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                        <DropdownMenuTrigger asChild>
                            <span className="flex items-center px-4 py-2 border border-purple-300 rounded-md cursor-pointer shadow-lg bg-background">
                                {mapLayers.find((layer) => layer.url === activeLayer)?.name || "Select Map Layer"}
                                <span className="ml-2">
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            align="start"
                            className="border border-gray-300 rounded-lg shadow-md"
                            style={{ zIndex: 1000 }} // Increase z-index explicitly
                        >
                            {mapLayers.map((layer) => (
                                <DropdownMenuItem
                                    key={layer.url}
                                    onClick={() => setActiveLayer(layer.url)}
                                    className={`cursor-pointer ${activeLayer === layer.url ? "bg-blue-500 " : "hover:bg-gray-200"
                                        }`}
                                >
                                    {layer.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
export default DashboardMap;