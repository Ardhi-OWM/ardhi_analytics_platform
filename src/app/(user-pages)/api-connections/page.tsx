"use client";
import React from "react";
import ApiLayout from "@/components/nav-pages/api-connections/ApiLayout";

const APIConnections: React.FC = () => {
    return (
        <div className="mt-18 relative ">
            <div className='w-full '>
                <ApiLayout />
            </div>
        </div>
    );
};

export default APIConnections;
