"use client";

import React, { useRef, useEffect, useState } from "react";
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";



import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Important: import Leaflet styles
import { mapLayers } from "@/components/constants";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";


export default function DashboardMap() {

    {/* ------------------------------ Variables ----------------------------*/ }
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const mapRef = useRef(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

    useEffect(() => {
        // Prevent multiple map initializations
        if (!isMapInitialized) {
            setIsMapInitialized(true);
        }

        return () => {
            // Cleanup when the component is unmounted to prevent memory leaks
            mapRef.current = null;
        };
    }, [isMapInitialized]);
    // ----------------------------------------------------------------------------------

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
                        <SidebarItems />
                    </Box>
                )}
            </div>

            {/* --------------------- Map Area (always mounted) ------------------ */}
            <div className="map-container h-3/4">
                <div className="flex-grow">
                    <div style={{ height: "75vh", width: "100%" }}>
                        {isMapInitialized && (
                            <MapContainer
                                center={[52.520008, 13.404954]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ width: "100%", height: "100%" }}
                                ref={mapRef}
                            >
                                {/* Render only the active layer dynamically */}
                                <TileLayer key={activeLayer} url={activeLayer} />
                            </MapContainer>
                        )}
                    </div>
                </div>
                {/* Layer Selector */}
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
