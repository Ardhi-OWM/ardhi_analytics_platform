"use client";
import { useState } from "react";
import { Divider } from "@nextui-org/divider";

import ConnectedModelDatasets from "./connected";
import OverviewModelDatasets from "./overview";

// Model & Dataset Layout Component
export default function ModelDatasetLayout() {
    const [activeTab, setActiveTab] = useState("connected");

    return (
        <div className="h-full mx-8">
            {/* Header Section */}
            <div className="my-6 mx-8">
                <Divider className="my-4" />
                <h1 className="text-4xl text-gray-500 roboto-mono-bold">
                    Connect to GIS Cloud Models & Datasets
                </h1>
                <Divider className="my-4" />
                <p>
                    Use Ardhi to connect to your favorite GIS cloud models and datasets for seamless analysis.
                    You can also use Ardhi to integrate on-premises data sources for a comprehensive workflow.
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
                        Connected Models & Datasets
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${activeTab === "overview"
                                ? "text-green-500 border-b-2 border-green-500"
                                : "text-gray-400 border-b-2 border-transparent hover:border-gray-500"
                            }`}
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview: Models & Datasets
                    </button>
                </div>

                {/* Conditional Rendering of Content */}
                {activeTab === "connected" && <ConnectedModelDatasets />}
                {activeTab === "overview" && <OverviewModelDatasets />}
            </div>
        </div>
    );
}
