"use client";
import dynamic from "next/dynamic";

//import MapComponent from "@/components/nav-pages/dashboard/Dashboard";
import React from "react";
const MapComponent = dynamic(() => import("@/components/nav-pages/dashboard/Dashboard"), {
    ssr: false,
  });


const Dashboard: React.FC = () => {
    return (
        <div className="mt-18 relative ">
            <div className="h-full ">
                <MapComponent />
            </div>
        </div>
    );
};

export default Dashboard;
