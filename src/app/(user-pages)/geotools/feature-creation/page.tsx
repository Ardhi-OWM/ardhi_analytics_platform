"use client";

import React from "react";
import dynamic from "next/dynamic";


const DigitizeMap = dynamic(() => import("@/components/nav-pages/geotools/featureCreation/DigitizeMap"), {
    ssr: false,
});


const FeatureCreation: React.FC = () => {
    return (
        <div className="mt-18 relative h-screen">
            <div className="h-full w-full">
                <div className="h-[calc(100vh-60px)] w-full">
                    <DigitizeMap />
                </div>
            </div>
        </div>

    );
};

export default FeatureCreation;


