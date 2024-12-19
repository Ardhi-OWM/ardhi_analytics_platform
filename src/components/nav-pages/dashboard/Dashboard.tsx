
'use client';
import React, { useState } from 'react';
import { Map } from "pigeon-maps"
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from 'lucide-react';

import { mapLayers } from '@/components/constants';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Update the import path as needed


export default function MapComponent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Tracks dropdown state

    const center: [number, number] = [52.520008, 13.404954];

    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

    // Custom tile provider function for Pigeon Maps
    type TileProvider = (x: number, y: number, z: number, dpr?: number) => string;

    const tileProvider: TileProvider = (x, y, z) =>
        activeLayer.replace("{x}", x.toString()).replace("{y}", y.toString()).replace("{z}", z.toString()).replace("{s}", "a");


    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-12'} 
            shadow-md transition-all duration-300 flex flex-col z-10 border-r border-gray-200/[0.25]} `}
            >
                <IconButton
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="self-end m-2"
                >
                    {/* Dynamically render the icon based on sidebar state */}
                    {sidebarOpen ? (
                        <PanelRightOpen className="text-muted-foreground" />
                    ) : (
                        <PanelLeftOpen className="text-muted-foreground" />
                    )}
                </IconButton>

                {sidebarOpen && (
                    <Box className="mt-2">
                        <p> <NotificationsIcon /> Notification</p>
                    </Box>
                )}
            </div>

            {/* Main Map Area */}
            <div style={{ flex: 1 }}>
                <div className="relative h-80vh">
                    {/* Map */}
                    <Map
                        boxClassname="relative"
                        height={500} // Adjust height as needed
                        defaultCenter={center}
                        defaultZoom={13}
                        provider={tileProvider}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute bottom-2 left-2 z-50">
                        <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                            <DropdownMenuTrigger asChild>
                                <span className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer shadow-lg bg-background">
                                    {mapLayers.find((layer) => layer.url === activeLayer)?.name || "Select Map Layer"}
                                    <span className="ml-2">
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </span>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                            side="top" 
                            align="start" 
                            className="border border-gray-300 rounded-lg shadow-md">
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

        </div>
    );
}


