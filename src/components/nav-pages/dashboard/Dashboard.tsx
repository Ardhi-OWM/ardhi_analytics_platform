"use client";

import React, { useState, useEffect } from "react";
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import { GeoJsonObject, Feature, Geometry, GeoJsonProperties } from 'geojson';
import { featureCollection } from "@turf/helpers";
import { toMercator } from "@turf/projection";


import { mapLayers } from "@/components/constants";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";
import SearchControl from "@/components/nav-pages/dashboard/db_functions";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


interface MapProps {
    geoJSONDataList?: GeoJsonObject[];
}

const DashboardMap: React.FC<MapProps> = () => {
    const [geoJSONDataList, setGeoJSONDataList] = useState<GeoJsonObject[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

    // --------------- ----------------------------------------------------------------
    // --------------- Zoom to data bounds when data is loaded or changed-------------
    const MapBounds: React.FC = () => {
        const map = useMap();

        useEffect(() => {
            if (!geoJSONDataList.length || !map) return;

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

    // --------------- ----------------------------------------------------------------
    // --------------- Change data to Leaflet CRS-------------
    useEffect(() => {
        geoJSONDataList.forEach((data, index) => {
            if ("features" in data) {
                console.log(`Dataset ${index + 1}:`, data);
            }
        });
    }, [geoJSONDataList]);

    // Convert GeoJSON to EPSG:3857 (Web Mercator) for Leaflet
    const convertToEPSG3857 = (geoJSON: GeoJsonObject) => {
        if (!("features" in geoJSON)) return geoJSON;
        return toMercator(featureCollection(geoJSON.features as Feature<Geometry, GeoJsonProperties>[]));
    };

    return (
        <div className="flex h-[calc(100vh-5rem)] overflow-hidden w-full">
            {/* Sidebar - Ensure it's always visible */}
            <div
                className={`transition-all duration-300 flex flex-col border-r border-gray-200/[0.25] bg-white z-50 ${sidebarOpen ? "w-64" : "min-w-12"}`}
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

            {/* Map Area */}
            <div className="relative flex-grow h-full">
                <MapContainer
                    center={[52.520008, 13.404954]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ width: "100%", height: "100%" }}
                    className="w-full h-full"
                >
                    <SearchControl />
                    <TileLayer key={activeLayer} url={activeLayer} />

                    {geoJSONDataList.map((geoJSONData, index) => (
                        <GeoJSON key={index} data={convertToEPSG3857(geoJSONData)} />
                    ))}
                    <MapBounds />

                    {/* Layer Selector Dropdown - Ensure it's inside the map */}
                    <div className="absolute bottom-2 left-2 z-[1001]">
                        <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                            <DropdownMenuTrigger asChild>
                                <span className="flex items-center px-6 py-3 border border-purple-300 rounded-md cursor-pointer shadow-lg bg-background text-base min-w-40">
                                    {mapLayers.find((layer) => layer.url === activeLayer)?.name || "Select Map Layer"}
                                    <span className="ml-2">
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </span>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="border border-gray-300 rounded-lg shadow-md bg-white"
                                style={{ zIndex: 1001 }}
                            >
                                {mapLayers.map((layer) => (
                                    <DropdownMenuItem
                                        key={layer.url}
                                        onClick={() => setActiveLayer(layer.url)}
                                        className={`cursor-pointer ${activeLayer === layer.url ? "bg-blue-500 " : "hover:bg-gray-200"}`}
                                    >
                                        {layer.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </MapContainer>
            </div>
        </div>
    );
}

export default DashboardMap;


