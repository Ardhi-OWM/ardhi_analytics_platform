
"use client";
import React from "react";

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

/* import dynamic from "next/dynamic";

// Dynamically import the Map component and disable SSR
const DashboardMap = dynamic(
    () => import("@/components/nav-pages/dashboard_leaflet"),
    { ssr: false, loading: () => <p>Loading map...</p> }
);

const Map: React.FC = () => {
    return (
        <div className="mt-18 relative ">
            <div className="h-96">
                <DashboardMap />
            </div>
        </div>
    );
};

export default Map; */