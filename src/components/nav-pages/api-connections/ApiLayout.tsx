"use client";
import { useState } from "react";
import { Divider } from "@nextui-org/divider";

import ConnectedApiEndpoints from "./connected";
import DeletedApiEndpoints from "./deleted";

// API Layout Component
export default function ApiLayout() {
    const [activeTab, setActiveTab] = useState("connected");

    return (
        <div className="h-full mx-8">
            {/* Header Section */}
            <div className="my-6 mx-8">
                <Divider className="my-4" />
                <h1 className="text-4xl text-gray-500 roboto-mono-bold">
                    Connect to GIS Cloud Services
                </h1>
                <Divider className="my-4" />
                <p>
                    Use Ardhi to connect to your favorite GIS Cloud Services and easily visualize your analytics.
                    You can also use Ardhi to connect to your on-premises data sources.
                </p>
            </div>

            {/* Tabs and Content */}
            <div className="flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-500/[.25] mb-2">
                    <button
                        className={`px-4 py-2 text-sm ${activeTab === "connected"
                                ? "text-green-500 border-b-2 border-green-500"
                                : "text-gray-400 border-b-2 border-transparent hover:border-green-500"
                            }`}
                        onClick={() => setActiveTab("connected")}
                    >
                        Connected
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${activeTab === "deleted"
                                ? "text-green-500 border-b-2 border-green-500"
                                : "text-gray-400 border-b-2 border-transparent hover:border-gray-500"
                            }`}
                        onClick={() => setActiveTab("deleted")}
                    >
                        Deleted API Endpoints
                    </button>
                </div>

                {/* Conditional Rendering of Content */}
                {activeTab === "connected" && <ConnectedApiEndpoints />}
                {activeTab === "deleted" && <DeletedApiEndpoints />}
            </div>
        </div>
    );
}
