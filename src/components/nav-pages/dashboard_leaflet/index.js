"use client";

import React, { useState } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";


import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Important: import Leaflet styles
import { mapLayers } from "@/components/constants";


export default function DashboardMap() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex flex-row h-screen">
            {/* Sidebar */}
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

            {/* Map Area (always mounted) */}
            <div className="flex-grow">
                <div className="h-full">
                    {/* Render MapArea exactly once */}
                    <MapContainer
                        center={[51.505, -0.09]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ width: "100%", height: "100%" }} // fill the container
                    >
                        {mapLayers.map((layer) => (
                            <TileLayer
                                key={layer.url}
                                url={layer.url}
                                //default={layer.default}
                            />
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
