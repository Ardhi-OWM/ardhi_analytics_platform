'use client';
import React, { useState } from 'react';
import { Map, ZoomControl } from "pigeon-maps";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

import { mapLayers } from '@/components/constants';
import SidebarItems from '@/components/nav-pages/dashboard/SidebarItems';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ButtonMine from '@/components/reusable/button-mine';

export default function MapComponent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [center, setCenter] = useState<[number, number]>([52.520008, 13.404954]);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );


    type TileProvider = (x: number, y: number, z: number, dpr?: number) => string;

    const tileProvider: TileProvider = (x, y, z) =>
        activeLayer.replace("{x}", x.toString()).replace("{y}", y.toString()).replace("{z}", z.toString()).replace("{s}", "a");

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert("Please enter a valid location or address.");
            return;
        }

        try {
            const response = await axios.get<{ lat: string, lon: string }[]>('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1,
                },
            });

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setCenter([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert("Location not found. Please refine your search.");
            }
        } catch {
            alert("Failed to search location. Please try again later.");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };


    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-12'} shadow-md transition-all duration-300 flex flex-col z-50 border-r border-gray-200/[0.25]`}>
                <IconButton
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="self-end m-2"
                >
                    {sidebarOpen ? (
                        <PanelRightOpen className="text-muted-foreground" />
                    ) : (
                        <PanelLeftOpen className="text-muted-foreground" />
                    )}
                </IconButton>
                {/* Sidebar Inputs*/}
                {sidebarOpen && (
                    <Box className="mt-2">
                        <SidebarItems />
                    </Box>
                )}
            </div>

            {/* Main Content  Area */}
            <div className='flex-1 flex flex-col'>
                <div style={{ flex: 1, position: 'relative' }}>
                    <div className="relative h-70vh ">
                        {/* Search Input */}
                        <div className="absolute right-4 z-40 p-4 rounded-md  sm:z-20 ">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter location or address"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                                />
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className='map-container h-3/4'>
                            <Map
                                boxClassname="relative h-full"
                                height={700}
                                center={center}
                                defaultZoom={13}
                                provider={tileProvider}
                            >
                                <ZoomControl /> {/* Add zoom control */}
                            </Map>
                        </div>


                        {/* Layer Selector */}
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
                                    className="border border-gray-300 rounded-lg shadow-md"
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
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center border-t w-1/2 mx-auto">
                        {/* Button 1 */}
                        <ButtonMine
                            className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight"
                            href="https://www.ardhi.de"
                            onClick={() => { }}
                            white={false}
                            px={4}
                        >
                            <span className="hover:text-green-600 hover:underline"> View Analytics </span>
                        </ButtonMine>

                        {/* Button 2 */}
                        <ButtonMine
                            className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight "
                            href="https://www.ardhi.de"
                            onClick={() => { }}
                            white={false}
                            px={4}
                        >
                            <span className="hover:text-green-600 hover:underline">Convert & Export View </span>
                        </ButtonMine>
                    </div>


                </div>

            </div>
        </div>
    );
}
