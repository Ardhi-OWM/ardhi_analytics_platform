"use client";

import { useState } from "react";
import { Link, MousePointerClick } from 'lucide-react';
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";

const SidebarItems: React.FC = () => {
    const [inputType, setInputType] = useState<"api" | "ml-model" | "dataset">("api");
    const [inputValue, setInputValue] = useState("");

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInputType(e.target.value as "api" | "ml-model" | "dataset");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

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
                </div>
            </div>
            <div className="my-4" >
                <label htmlFor="input-type" className="text-sm font-medium flex flex-row space-x-2 mt-4">
                    <Link className="text-green-300 ml-2" />
                    <p>Link to Data to Visualize</p>
                </label>
                <Input
                    id="dynamic-input"
                    type="text"
                    placeholder="Enter Link to Data"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="border-purple-400/[.25] g focus:border-purple-500 ibm-plex-mono-regular-italic"
                    aria-label="Data Link"
                />

            </div>
            {/* Empty Section */}
            <div className="my-4" />

            {/* Subscription form section */}
            <div className="space-y-4 mx-2">
                <SubscriptionForm />
            </div>
        </div>
    );
};

export default SidebarItems;
