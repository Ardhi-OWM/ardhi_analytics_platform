"use client";

import React, { useState } from "react";

const GeoTools: React.FC = () => {
    const [showFeatureDetails, setShowFeatureDetails] = useState(false);
    const [showChatDetails, setShowChatDetails] = useState(false);

    return (
        <div className="w-full min-h-screen overflow-hidden p-12 bg-gray-100 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-green-500">
                    GeoTools in Ardhi WebGIS
                </h1>

                <p className="text-lg mb-8 text-gray-700">
                    Ardhi WebGIS offers a suite of <strong>Geo-Tools</strong> designed to streamline spatial data handling. 
                    Whether you’re mapping geographic features, analyzing geospatial data, or exploring remote sensing insights, 
                    these tools provide an intuitive and efficient workflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Feature Creation Section with Read More */}
                    <div className="relative">
                        <div className="absolute inset-0 -translate-x-2 -translate-y-2 bg-green-300 rounded-lg -z-10"></div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-xl relative">
                            <h2 className="text-2xl font-semibold mb-4 text-center text-green-500">
                                Feature Creation
                            </h2>
                            <p className="text-gray-700">
                                The <strong>Feature Creation</strong> tool in Ardhi WebGIS allows users to <b>digitize geographic features</b> 
                                directly on an interactive map. Users can draw points, lines, and polygons, adjust their shapes, 
                                and export them in <b>GeoJSON format</b> for seamless integration with GIS platforms.
                            </p>
                            
                            <h3 className="text-xl font-semibold mt-4">How It Works</h3>
                            <ul className="list-disc list-inside text-gray-700 mt-2">
                                <li><strong>📍 Draw Features</strong>: Create <b>points, lines, and polygons</b> to define areas of interest.</li>
                                <li><strong>🗺️ Interactive Mapping</strong>: Use the search feature to navigate and zoom into specific locations.</li>
                                <li><strong>📥 Export as GeoJSON</strong>: Download digitized features in a standard GIS-compatible format.</li>
                                <li><strong>🔄 Editable Features</strong>: Modify, reshape, or remove features before exporting.</li>
                                <li><strong>🌍 Custom Basemaps</strong>: Switch between different map providers (e.g., OpenStreetMap).</li>
                            </ul>

                            {/* Read More Section */}
                            {showFeatureDetails && (
                                <div className="mt-4 text-gray-700">
                                    <h3 className="text-xl font-semibold">Advanced Features</h3>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>🚀 <b>Real-time Collaboration</b>: Work on mapping projects as a team.</li>
                                        <li>📍 <b>Advanced Snapping</b>: Align features with precision.</li>
                                        <li>🛠️ <b>External GIS Integration</b>: Connect to platforms like ArcGIS & QGIS.</li>
                                        <li>📊 <b>Topological Validation</b>: Ensure geometric accuracy in digitized features.</li>
                                    </ul>
                                </div>
                            )}

                            {/* Read More Button */}
                            <button 
                                onClick={() => setShowFeatureDetails(!showFeatureDetails)} 
                                className="mt-4 text-green-500 hover:underline focus:outline-none text-lg font-semibold"
                            >
                                {showFeatureDetails ? "Read Less ▲" : "Read More ▼"}
                            </button>
                        </div>
                    </div>

                    {/* Ardhi Chat Section with Read More */}
                    <div className="relative">
                        <div className="absolute inset-0 -translate-x-2 -translate-y-2 bg-green-300 rounded-lg -z-10"></div>

                        <div className="bg-white p-6 rounded-lg shadow-xl relative">
                            <h2 className="text-2xl font-semibold mb-4 text-center text-green-500">
                                Ardhi Chat
                            </h2>
                            <p className="text-gray-700">
                                <strong>Ardhi Chat</strong> is an AI-powered assistant built into the platform to help users with geospatial operations, 
                                dataset management, and troubleshooting. If you’re unsure about a tool, need insights on your data, 
                                or require step-by-step guidance, Ardhi Chat is here to assist.
                                <br />
                                <br />
                                <strong className="block text-center text-green-500 text-lg">MORE COMING SOON!!!</strong> 
                            </p>

                            

                            {/* Read More Section */}
                            {showChatDetails && (
                                <div className="mt-4 text-gray-700">
                                    <h3 className="text-xl font-semibold">Future Enhancements</h3>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>💡 <b>AI-Powered Insights</b>: Get smart recommendations on data analysis.</li>
                                        <li>📜 <b>Step-by-Step Tutorials</b>: Learn how to use tools with interactive guides.</li>
                                        <li>🔍 <b>Smart Search</b>: Easily find datasets, GIS layers, and models.</li>
                                        <li>🌍 <b>Multilingual Support</b>: Access guidance in multiple languages.</li>
                                    </ul>
                                </div>
                            )}

                            {/* Read More Button */}
                            <button 
                                onClick={() => setShowChatDetails(!showChatDetails)} 
                                className="mt-4 text-green-500 hover:underline focus:outline-none text-lg font-semibold"
                            >
                                {showChatDetails ? "Read Less ▲" : "Read More ▼"}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-lg mt-12 text-gray-700 text-center">
                    With these tools, Ardhi WebGIS empowers users to efficiently create, analyze, and 
                    interact with geospatial data, making geographic information accessible and actionable. 🚀
                </p>
            </div>
        </div>
    );
};

export default GeoTools;
