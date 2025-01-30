"use client";
import { useState } from "react";
import React from "react";
import dynamic from "next/dynamic";
import { GeoJsonObject } from "geojson";

//import MapComponent from "@/components/nav-pages/dashboard/Dashboard";
const MapComponent = dynamic(() => import("@/components/nav-pages/dashboard/Dashboard"), {
    ssr: false,
  });


const Dashboard: React.FC = () => {
    const [geoJSONDataList] = useState<GeoJsonObject[]>([]);
    return (
        <div className="mt-18 relative ">
            <div className="h-full ">
            <MapComponent geoJSONDataList={geoJSONDataList} />
            </div>
        </div>
    );
};

export default Dashboard;
