
"use client";
/* import React from "react";

import DashboardMap  from "@/components/nav-pages/dashboard_leaflet";

const Map: React.FC = () => {
    return (
        <div className="mt-18 relative ">
            <div className="h-96">
                <DashboardMap />
            </div>
        </div>
    );
};

export default Map; 
 */


import dynamic from "next/dynamic";

// Dynamically import the map and disable SSR for Leaflet
const DashboardMap = dynamic(
    () => import("@/components/nav-pages/dashboard_leaflet"),
    {
        ssr: false, // Prevents SSR issues
        loading: () => <p>Loading map...</p>,
    }
);

export default function MapPage() {
    return (
        <div
            className="mt-18 relative "
            style={{ height: "100vh", width: "100%" }}>
            <DashboardMap />
        </div>
    );
}
