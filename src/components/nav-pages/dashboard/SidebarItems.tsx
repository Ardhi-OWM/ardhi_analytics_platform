"use client";

import { useState } from "react";
import { Link, MousePointerClick } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import apiClient from "@/lib/apiClient"; // Centralized API client
import { GeoJsonObject, FeatureCollection } from "geojson";
import proj4 from "proj4";
import { toWgs84 } from "@turf/projection";

// Internal Components
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";
import FileUpload from "@/components/nav-pages/dashboard/FileUpload";

interface ModelInput {
    user_id: string;
    input_type: "API" | "Model" | "Dataset";
    data_link: string;
}

interface SidebarItemsProps {
    geoJSONDataList: GeoJsonObject[];
    setGeoJSONDataList: React.Dispatch<React.SetStateAction<GeoJsonObject[]>>;
    fetchModels: () => Promise<void>;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ geoJSONDataList, setGeoJSONDataList, fetchModels }) => {
    const [inputType, setInputType] = useState<"api" | "ml-model" | "dataset">("api");
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataUrl, setDataUrl] = useState("");
    const { user } = useUser();

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setInputType(e.target.value as "api" | "ml-model" | "dataset");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value);

    const handleSubmit = async () => {
        if (!user) {
            alert("You need to be logged in to add a service");
            return;
        }

        const formattedInputType: ModelInput["input_type"] =
            inputType === "api" ? "API" : inputType === "ml-model" ? "Model" : "Dataset";

        const payload: ModelInput = {
            user_id: user.id,
            input_type: formattedInputType,
            data_link: inputValue,
        };

        console.log("🔹 Payload Sent:", payload);

        try {
            setIsSubmitting(true);
            const response = await apiClient.post<{ success: boolean }>("/inputs/", payload);
            console.log("✅ Response:", response.data);
            alert("Service added successfully!");
            setInputValue("");

            await fetchModels();
        } catch (error: unknown) {
            console.error("❌ Error adding service:", error);

            if (error instanceof Error) {
                alert(`Failed to add service: ${error.message}`);
            } else {
                alert("Failed to add service. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getLabelAndPlaceholder = (type: string) => {
        switch (type) {
            case "api":
                return { label: "Enter API", placeholder: "API Endpoint" };
            case "ml-model":
                return { label: "Enter Link to the Model", placeholder: "Model URL" };
            default:
                return { label: "Enter Link to Dataset", placeholder: "Dataset URL" };
        }
    };

    const { label, placeholder } = getLabelAndPlaceholder(inputType);

    const handleFileUpload = async (uploadedFile: File) => {
        if (!uploadedFile.name.endsWith(".geojson")) {
            console.log("Unsupported file format");
            return;
        }

        try {
            const fileText = await uploadedFile.text();
            let geoJSON = JSON.parse(fileText) as FeatureCollection;

            const geoJSONWithCRS = geoJSON as FeatureCollection & { crs?: { properties?: { name?: string } } };
            if (geoJSONWithCRS.crs?.properties?.name) {
                const originalCrs = geoJSONWithCRS.crs.properties.name;
                console.log("Detected CRS:", originalCrs);

                if (originalCrs !== "urn:ogc:def:crs:OGC:1.3:CRS84" && originalCrs !== "EPSG:4326") {
                    geoJSON = transformGeoJSON(geoJSON, originalCrs);
                }
            } else {
                console.warn("No CRS detected, assuming EPSG:4326");
            }

            setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
            console.log("Uploaded and transformed GeoJSON:", geoJSON);
        } catch (error) {
            console.error("Error parsing GeoJSON:", error);
        }
    };

    const transformGeoJSON = (geoJSON: FeatureCollection, sourceCrs: string): FeatureCollection => {
        try {
            proj4.defs([
                ["EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"],
                ["EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
            ]);

            return toWgs84(geoJSON, { mutate: true });
        } catch (error) {
            console.error("Error transforming CRS:", error);
            return geoJSON;
        }
    };

    const handleUrlLoad = async () => {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch GeoJSON from URL");
            }
            const geoJSON = (await response.json()) as GeoJsonObject;
            setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
            console.log("Loaded GeoJSON from URL:", geoJSON);
        } catch (error) {
            console.error("Error loading GeoJSON from URL:", error);
        }
    };

    return (
        <div className="flex flex-col space-y-8 mx-2">
            <div className="space-y-4">
                <label htmlFor="input-type" className="text-sm font-medium flex flex-row space-x-2">
                    <MousePointerClick className="text-green-500 ml-2 rotate-90" />
                    <p className="uppercase font-bold">Select Input Type</p>
                </label>
                <select
                    id="input-type"
                    className="block w-full px-2 border border-purple-400/[.25] rounded bg-background focus:border-purple-500 text-sm"
                    value={inputType}
                    onChange={handleTypeChange}
                >
                    <option value="api">API</option>
                    <option value="ml-model">Link to Model</option>
                    <option value="dataset">Link to Dataset</option>
                </select>
                <div>
                    <label htmlFor="dynamic-input" className="block text-xs font-medium">
                        {label}
                    </label>
                    <Input
                        id="dynamic-input"
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        className="border-purple-400/[.25] ibm-plex-mono-regular-italic"
                        aria-label={label}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`mt-4 px-4 py-1 rounded ${
                            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white dark:text-black hover:bg-blue-600 w-3/4 text-sm"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Service"}
                    </button>
                </div>
            </div>

            <div className="my-4">
                <label htmlFor="data-link" className="text-sm font-medium flex flex-row space-x-2">
                    <Link className="text-green-300 ml-1" />
                    <p className="uppercase font-bold">Load Data to Visualize </p>
                </label>
                <FileUpload onFileUpload={handleFileUpload} />
                <Input
                    id="data-link"
                    type="text"
                    placeholder="Enter Link to Data"
                    value={dataUrl}
                    onChange={(e) => setDataUrl(e.target.value)}
                    className="border-purple-400/[.25] focus:border-purple-500 ibm-plex-mono-regular-italic text-xs"
                    aria-label="Data Link"
                />
                <button
                    onClick={handleUrlLoad}
                    className="w-3/4 mt-4 bg-green-500 text-white dark:text-black px-4 py-1 rounded hover:bg-green-600 text-sm font-medium"
                >
                    Submit
                </button>
            </div>

            <div>
                <h1 className="text-sm font-bold">Uploaded Datasets</h1>
                {geoJSONDataList.length === 0 && <p className="text-sm">No datasets uploaded yet.</p>}
                <ul className="mt-2">
                    {geoJSONDataList.map((_, index) => (
                        <li key={index} className="flex justify-between items-center p-2 mb-2">
                            <span className="text-sm ibm-plex-mono-medium-italic">Dataset {index + 1}</span>
                            <button
                                className="bg-red-500  px-3  rounded hover:bg-red-600 text-sm"
                                onClick={() => setGeoJSONDataList((prevData) => prevData.filter((_, i) => i !== index))}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* ----------------- ------------------------------------------ */}
            {/* ----------------- Newsletter subscription---------------- */}
            <div className="space-y-4 mx-2">
                <SubscriptionForm />
            </div>
        </div>
    );
};

export default SidebarItems;
