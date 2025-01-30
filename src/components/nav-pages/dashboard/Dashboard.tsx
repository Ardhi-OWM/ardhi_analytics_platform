"use client";

import React, { useEffect, useState } from "react";
import { PanelLeftOpen, PanelRightOpen, ChevronDown, ChevronUp } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import { mapLayers } from "@/components/constants";
import SidebarItems from "@/components/nav-pages/dashboard/SidebarItems";

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

// ------------------  Main DashboardMap Component (No map changes) ------------------
export default function DashboardMap() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

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

            {/* --------------------- Map Area (Leaflet) ------------------ */}
            <div className="map-container h-3/4">
                <div className="flex-grow">
                    <div style={{ height: "75vh", width: "100%" }}>
                        <MapContainer
                            center={[52.520008, 13.404954]}
                            zoom={13}
                            scrollWheelZoom={false}  // 🔥 Keeps the map behavior unchanged
                            style={{ width: "100%", height: "100%" }}
                        >
                            {/*  Custom Search Control (Replaces GeoSearchControl) */}
                            <SearchControl />
                            {/*  Map Layer */}
                            <TileLayer key={activeLayer} url={activeLayer} />
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
