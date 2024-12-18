
'use client';
import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

export default function MapComponent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-12'} 
            shadow-md transition-all duration-300 flex flex-col z-10 `}
            >
                <IconButton
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="self-end m-2"
                >
                    {/* Dynamically render the icon based on sidebar state */}
                    {sidebarOpen ? (
                        <PanelRightOpen  className="text-muted-foreground"/>
                    ) : (
                        <PanelLeftOpen className="text-muted-foreground" />
                    )}
                </IconButton>

                {sidebarOpen && (
                    <Box className="mt-2">
                        <p> <NotificationsIcon/> Notification</p>
                    </Box>
                )}
            </div>

            {/* Main Map Area */}
            <div style={{ flex: 1 }}>
                <MapContainer
                    center={[52.520008, 13.404954]}
                    zoom={13}
                    style={{ height: '70%', width: '100%' }}
                    className="leaflet-container rounded"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>
        </div>
    );
}


