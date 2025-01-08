"use client";
// Precoded components
import { useState } from "react";
import { Link, MousePointerClick } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// In directory components 
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";
import { handleDataChange, inputData } from "./db_functions";
import { addService, parseApiUrl } from "@/components/nav-pages/api-connections/ft_functions";

const SidebarItems: React.FC = () => {
    const [inputType, setInputType] = useState<"api" | "ml-model" | "dataset">("api");
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataUrl, setDataUrl] = useState("");
    const { user } = useUser();

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInputType(e.target.value as "api" | "ml-model" | "dataset");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

    const handleSubmit = async () => {

        if (!user) return alert("You need to be logged in to add a service");

        const { name, provider, region, apiUrl } = parseApiUrl(inputValue);

        await addService(
            {
                name,
                provider,
                region,
                apiUrl,
                user_id: user.id  // Added user_id to the object
            },
            user.id,
            () => { },
            setIsSubmitting
        );
        alert("Service added successfully!");
    };

    const getLabelAndPlaceholder = (type: string) => {
        if (type === "api")
            return {
                label: "Enter API",
                placeholder: "API Endpoint"
            };
        if (type === "ml-model")
            return {
                label: "Enter Link to the Model",
                placeholder: "Model URL"
            };
        return {
            label: "Enter Link to Dataset",
            placeholder: "Dataset URL"
        };
    };

    const { label, placeholder } = getLabelAndPlaceholder(inputType);

    return (
        <div className="flex flex-col space-y-8 mx-2">
            <div className="space-y-4 s">
                <label htmlFor="input-type" className=" text-sm font-medium flex flex-row space-x-2">
                    <MousePointerClick className="text-green-300 ml-2 rotate-90" />
                    <p >Select Input Type</p>
                </label>
                <select
                    id="input-type"
                    aria-label="Input type selector"
                    className="block w-full px-2 border border-purple-400/[.25] 
                    rounded bg-background focus:border-purple-500 text-sm"
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
                        className="mt-4 bg-blue-500 text-white px-4 py-1 rounded"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Service"}
                    </button>
                </div>
            </div>
            <div className="my-4">
                <label htmlFor="input-type" className="text-sm font-medium flex flex-row space-x-2 mt-4">
                    <Link className="text-green-300 ml-2" />
                    <p>Link to Data to Visualize</p>
                </label>
                <Input
                    id="dynamic-input"
                    type="text"
                    placeholder="Enter Link to Data"
                    value={dataUrl}
                    onChange={(e) => handleDataChange(e, setDataUrl)}
                    className="border-purple-400/[.25] g focus:border-purple-500 ibm-plex-mono-regular-italic"
                    aria-label="Data Link"
                />
                <button
                    onClick={() => inputData(dataUrl)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>

            </div>
            <div className="my-4" />

            <div className="space-y-4 mx-2">
                <SubscriptionForm />
            </div>
        </div>
    );
};

export default SidebarItems;
