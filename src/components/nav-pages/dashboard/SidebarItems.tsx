import React, { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";

interface SidebarItemsProps {
  onImageUpload: (images: { name: string; url: string; bounds: number[][]; height: number; width: number }[]) => void;
  onGeoJSONUpload: (geojson: { name: string; data: any; visible: boolean }) => void; // Add visible property
  onToggleImage: (name: string) => void;
  onToggleGeoJSON: (name: string) => void; // New prop for toggling GeoJSON visibility
  uploadedImages?: { name: string; url: string; visible: boolean }[];
  uploadedGeoJSONs?: { name: string; data: any; visible: boolean }[]; // Add GeoJSON list
}

const SidebarItems: React.FC<SidebarItemsProps> = ({
  onImageUpload,
  onGeoJSONUpload,
  onToggleImage,
  onToggleGeoJSON,
  uploadedImages = [],
  uploadedGeoJSONs = [], // Default to empty array
}) => {
  const [inputType, setInputType] = useState<"api" | "ml-model" | "dataset">("api");
  const [inputValue, setInputValue] = useState("");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setInputType(e.target.value as "api" | "ml-model" | "dataset");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        bounds: [[52.55312, 13.28411], [52.54796, 13.29706]],
        height: 2952,
        width: 4316,
        visible: true,
      }));
      onImageUpload(imageFiles);
      alert(`${imageFiles.length} image(s) uploaded.`);
    } else {
      alert("No images selected.");
    }
  };

  const handleGeoJSONSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const geojson = JSON.parse(e.target?.result as string);
        onGeoJSONUpload({ name: file.name, data: geojson, visible: true }); // Default visibility is true
        alert(`GeoJSON file "${file.name}" uploaded.`);
      };
      reader.readAsText(file);
    } else {
      alert("No GeoJSON file selected.");
    }
  };

  return (
    <div className="flex flex-col space-y-8 mx-2">
      <div className="space-y-4">
        <label htmlFor="input-type" className="text-sm font-medium flex flex-row space-x-2">
          <MousePointerClick className="text-green-300 ml-2 rotate-90" />
          <p>Select Input Type</p>
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
            {inputType === "api"
              ? "Enter API"
              : inputType === "ml-model"
              ? "Enter Link to the Model"
              : "Enter Link to Dataset"}
          </label>
          <Input
            id="dynamic-input"
            type="text"
            placeholder="Enter URL or API Endpoint"
            value={inputValue}
            onChange={handleInputChange}
            className="border-purple-400/[.25]"
          />
        </div>
      </div>

      <div className="space-y-4 mx-2">
        <label htmlFor="image-input" className="block text-sm font-medium">
          Select Images
        </label>
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelection}
          className="block w-full px-2 py-1 border border-purple-400/[.25] rounded bg-background focus:border-purple-500 text-sm"
        />
      </div>

      <div className="space-y-4 mx-2">
        <label htmlFor="geojson-input" className="block text-sm font-medium">
          Upload GeoJSON
        </label>
        <input
          id="geojson-input"
          type="file"
          accept=".geojson,.json"
          onChange={handleGeoJSONSelection}
          className="block w-full px-2 py-1 border border-purple-400/[.25] rounded bg-background focus:border-purple-500 text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
        <ul className="space-y-2">
          {uploadedImages.map((image) => (
            <li key={image.name} className="flex items-center justify-between">
              <span className="text-sm">{image.name}</span>
              <button
                className={`text-xs px-2 py-1 rounded ${
                  image.visible ? "bg-green-400" : "bg-red-400"
                } text-white`}
                onClick={() => onToggleImage(image.name)}
              >
                {image.visible ? "Hide" : "Show"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Uploaded GeoJSON Files</h3>
        <ul className="space-y-2">
          {uploadedGeoJSONs.map((geojson) => (
            <li key={geojson.name} className="flex items-center justify-between">
              <span className="text-sm">{geojson.name}</span>
              <button
                className={`text-xs px-2 py-1 rounded ${
                  geojson.visible ? "bg-green-400" : "bg-red-400"
                } text-white`}
                onClick={() => onToggleGeoJSON(geojson.name)}
              >
                {geojson.visible ? "Hide" : "Show"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-4" />
      <div className="space-y-4 mx-2">
        <SubscriptionForm />
      </div>
    </div>
  );
};

export default SidebarItems;