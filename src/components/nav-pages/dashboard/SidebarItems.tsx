"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";

const SidebarItems: React.FC = () => {
    const [inputType, setInputType] = useState<"api" | "ml-model" | "dataset">("api");
    const [inputValue, setInputValue] = useState("");

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInputType(e.target.value as "api" | "ml-model" | "dataset");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

    const getLabelAndPlaceholder = (type: string) => {
        if (type === "api") return { label: "Enter API", placeholder: "API Endpoint" };
        if (type === "ml-model") return { label: "Enter Link to the Model", placeholder: "Model URL" };
        return { label: "Enter Link to Dataset", placeholder: "Dataset URL" };
    };

    const { label, placeholder } = getLabelAndPlaceholder(inputType);

    return (
        <div className="flex flex-col space-y-8">
            <div className="space-y-4 mx-2">
                <label htmlFor="input-type" className="block text-sm font-medium">
                    Select Input Type
                </label>
                <select
                    id="input-type"
                    aria-label="Input type selector"
                    className="block w-full px-3 py-2 border border-gray-400/[.25] rounded-md bg-transparent focus:ring focus:border-blue-500"
                    value={inputType}
                    onChange={handleTypeChange}
                >
                    <option value="api">API</option>
                    <option value="ml-model">Link to Model</option>
                    <option value="dataset">Link to Dataset</option>
                </select>
    
                <div>
                    <label htmlFor="dynamic-input" className="block text-sm font-medium">
                        {label}
                    </label>
                    <Input
                        id="dynamic-input"
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        className="border-gray-400/[.25] focus:ring focus:border-blue-500 ibm-plex-mono-regular-italic"
                        aria-label={label}
                    />
                </div>
            </div>
             {/* Empty Section */}
            <div className="my-4"/>
            
            {/* Subscription form section */}
            <div className="space-y-4 mx-2">
                <SubscriptionForm />
            </div>
        </div>
    );
};

export default SidebarItems;
