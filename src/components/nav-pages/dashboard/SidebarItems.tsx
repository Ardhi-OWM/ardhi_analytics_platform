"use client";
import { useState } from "react";
import { Link } from "lucide-react";
import * as GeoTIFF from "geotiff";
import * as jpeg from "jpeg-js";
import * as L from "leaflet";
import { GeoJsonObject, FeatureCollection, Feature } from "geojson";
import * as toGeoJSON from "@tmcw/togeojson"; 
import Papa from "papaparse"; 
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import SubscriptionForm from "./SubscriptionForm";
import FileUpload from "@/components/nav-pages/dashboard/FileUpload";



interface SidebarItemsProps {
    geoJSONDataList: GeoJsonObject[];
    setGeoJSONDataList: React.Dispatch<React.SetStateAction<GeoJsonObject[]>>;
    setGeoTIFFOverlay: React.Dispatch<React.SetStateAction<L.ImageOverlay | null>>;
    // fetchModels: () => Promise<void>;
    onRemoveImage: () => void; // Add onRemoveImage prop
}

type TableRow = Record<string, string | number | boolean | null>;

const SidebarItems: React.FC<SidebarItemsProps> = ({ geoJSONDataList, setGeoJSONDataList, setGeoTIFFOverlay,  onRemoveImage }) => {
   
    const [dataUrl, setDataUrl] = useState("");
 

    const processGeoTIFF = async (file: File | ArrayBuffer, fileName: string) => {
        try {
            const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
            const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
            const image = await tiff.getImage();
            const raster = await image.readRasters();

            const width = raster.width;
            const height = raster.height;

            if (raster.length < 3) {
                console.error("GeoTIFF does not have enough bands for RGB color.");
                return null;
            }

            const red = raster[0];
            const green = raster[1];
            const blue = raster[2];

            const rgbData = new Uint8Array(width * height * 4);
            for (let i = 0; i < width * height; i++) {
                rgbData[i * 4] = red[i];
                rgbData[i * 4 + 1] = green[i];
                rgbData[i * 4 + 2] = blue[i];
                rgbData[i * 4 + 3] = 255;
            }

            const rawImageData = {
                data: rgbData,
                width,
                height,
            };

            const jpegImageData = jpeg.encode(rawImageData, 100);
            const blob = new Blob([jpegImageData.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(blob);

            const bbox = image.getBoundingBox();
            const bounds: L.LatLngBoundsExpression = [
                [bbox[1], bbox[0]],
                [bbox[3], bbox[2]],
            ];

            const overlay = L.imageOverlay(imageUrl, bounds);
            setGeoTIFFOverlay(overlay);

            return {
                type: "FeatureCollection",
                features: [],
                properties: {
                    name: fileName,
                    type: "GeoTIFF",
                    bounds,
                    imageUrl,
                },
            } as GeoJsonObject;
        } catch (error) {
            console.error("Error processing GeoTIFF:", error);
            return null;
        }
    };

    const handleFileUpload = async (uploadedFile: File) => {
        const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();

        if (fileExtension === "geojson") {
            try {
                const fileText = await uploadedFile.text();
                const geoJSON = JSON.parse(fileText) as FeatureCollection;
                setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
                console.log("✅ Uploaded GeoJSON:", geoJSON);
            } catch (error) {
                console.error("❌ Error parsing GeoJSON:", error);
            }
        } else if (fileExtension === "csv") {
            try {
                const fileText = await uploadedFile.text();
                Papa.parse<TableRow>(fileText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (result) => {
                        processTableData(result.data, "CSV");
                    },
                });
            } catch (error) {
                console.error("❌ Error parsing CSV:", error);
            }
        } else if (fileExtension === "kml") {
            try {
                const fileText = await uploadedFile.text();
                const parser = new DOMParser();
                const kml = parser.parseFromString(fileText, "text/xml");
                const geoJSON = toGeoJSON.kml(kml) as FeatureCollection;

                setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
                console.log("✅ Uploaded KML as GeoJSON:", geoJSON);
            } catch (error) {
                console.error("❌ Error parsing KML:", error);
            }
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
            try {
                const fileBuffer = await uploadedFile.arrayBuffer();
                const workbook = XLSX.read(fileBuffer, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData: TableRow[] = XLSX.utils.sheet_to_json(sheet, { raw: true });

                processTableData(jsonData, "Excel");
            } catch (error) {
                console.error("❌ Error parsing Excel file:", error);
            }
        } else if (fileExtension === "tif" || fileExtension === "tiff") {
            const geoJSON = await processGeoTIFF(uploadedFile, uploadedFile.name);
            if (geoJSON) {
                setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
            }
        } else {
            console.log("❌ Unsupported file format");
        }
    };

    const handleUrlLoad = async () => {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch data from URL");
            }

            if (dataUrl.endsWith(".geojson")) {
                const geoJSON = (await response.json()) as GeoJsonObject;
                setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
                console.log("Loaded GeoJSON from URL:", geoJSON);
            } else if (dataUrl.endsWith(".tif") || dataUrl.endsWith(".tiff")) {
                const arrayBuffer = await response.arrayBuffer();
                const geoJSON = await processGeoTIFF(arrayBuffer, dataUrl);
                if (geoJSON) {
                    setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
                }
            } else {
                console.log("Unsupported file format");
            }
        } catch (error) {
            console.error("Error loading data from URL:", error);
        }
    };

    const processTableData = (rows: TableRow[], source: "CSV" | "Excel") => {
        if (!rows.length) {
            console.error(`❌ ${source} file is empty`);
            return;
        }

        const features: Feature[] = [];

        rows.forEach((row) => {
            if (row.geometry === "MultiPolygon" && row.coordinates) {
                try {
                    console.log(`🔹 Raw MultiPolygon Coordinates from ${source}:`, row.coordinates);

                    let rawCoords = row.coordinates;
                    if (typeof rawCoords === "string") {
                        rawCoords = JSON.parse(`[${rawCoords}]`);
                    }

                    console.log(`✅ Parsed MultiPolygon coordinates from ${source}:`, rawCoords);

                    if (!Array.isArray(rawCoords)) {
                        throw new Error("Coordinates are not an array");
                    }

                    const filteredCoords: [number, number][][][] = [];
                    const currentRing: [number, number][] = [];

                    for (let i = 0; i < rawCoords.length; i += 3) {
                        if (rawCoords[i + 1] !== undefined) {
                            let lng = parseFloat(rawCoords[i] as string);
                            let lat = parseFloat(rawCoords[i + 1] as string);

                            if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                                [lat, lng] = [lng, lat];
                            }

                            if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                                currentRing.push([lng, lat]);
                            } else {
                                console.error(`❌ Skipping invalid coordinate pair: [${lng}, ${lat}]`);
                            }
                        }
                    }

                    if (currentRing.length > 0) {
                        filteredCoords.push([currentRing]);
                    }

                    console.log(`✅ Final MultiPolygon Structure from ${source}:`, filteredCoords);

                    features.push({
                        type: "Feature",
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: filteredCoords,
                        },
                        properties: { 
                            ...row, 
                            coordinates: undefined, 
                        },
                    });
                } catch (error) {
                    console.error(`❌ Error parsing MultiPolygon coordinates from ${source}:`, error);
                }
            } else if (row.geometry === "Polygon" && row.coordinates) {
                try {
                    console.log(`🔹 Raw Polygon Coordinates from ${source}:`, row.coordinates);

                    let rawCoords = row.coordinates;
                    if (typeof rawCoords === "string") {
                        rawCoords = JSON.parse(`[${rawCoords}]`);
                    }

                    console.log(`✅ Parsed Polygon coordinates from ${source}:`, rawCoords);

                    if (!Array.isArray(rawCoords)) {
                        throw new Error("Coordinates are not an array");
                    }

                    const polygonCoords: [number, number][][] = [];
                    const currentRing: [number, number][] = [];

                    for (let i = 0; i < rawCoords.length; i += 3) {
                        if (rawCoords[i + 1] !== undefined) {
                            let lng = parseFloat(rawCoords[i] as string);
                            let lat = parseFloat(rawCoords[i + 1] as string);

                            if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                                console.warn(`🚨 Invalid coordinate detected: [${lng}, ${lat}]. Attempting to swap...`);
                                [lat, lng] = [lng, lat];
                            }

                            if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                                currentRing.push([lng, lat]);
                            } else {
                                console.error(`❌ Skipping invalid coordinate pair: [${lng}, ${lat}]`);
                            }
                        }
                    }

                    if (currentRing.length > 0) {
                        polygonCoords.push(currentRing);
                    }

                    console.log(`✅ Final Polygon Structure from ${source}:`, polygonCoords);

                    features.push({
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: polygonCoords,
                        },
                        properties: { 
                            ...row, 
                            coordinates: undefined, 
                        },
                    });
                } catch (error) {
                    console.error(`❌ Error parsing Polygon coordinates from ${source}:`, error);
                }
            } else if (row.latitude && row.longitude) {
                let lng = parseFloat(row.longitude as string);
                let lat = parseFloat(row.latitude as string);

                if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                    console.warn(`🚨 Invalid point coordinate: [${lng}, ${lat}]. Swapping...`);
                    [lat, lng] = [lng, lat];
                }

                if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                    features.push({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [lng, lat],
                        },
                        properties: row,
                    });
                } else {
                    console.error(`❌ Skipping invalid point: [${lng}, ${lat}]`);
                }
            }
        });

        const geoJSON: FeatureCollection = {
            type: "FeatureCollection",
            features,
        };

        setGeoJSONDataList((prevData) => [...prevData, geoJSON]);
        console.log(`✅ Uploaded ${source} as GeoJSON:`, geoJSON);
    };

    const handleRemoveDataset = (index: number) => {
        setGeoJSONDataList((prevData) => prevData.filter((_, i) => i !== index));
        onRemoveImage(); // Call the onRemoveImage function to remove the image overlay
    };

    return (
        <div className="flex flex-col space-y-8 mx-2">
         

            {/* Link to visualize data */}
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

            {/* Uploaded Datasets */}
            <div>
                <h1 className="text-sm font-bold">Uploaded Datasets</h1>
                {geoJSONDataList.length === 0 && <p className="text-sm">No datasets uploaded yet.</p>}
                <ul className="mt-2">
                    {geoJSONDataList.map((_, index) => (
                        <li key={index} className="flex justify-between items-center p-2 mb-2">
                            <span className="text-sm ibm-plex-mono-medium-italic">Dataset {index + 1}</span>
                            <button
                                className="bg-red-500 px-3 rounded hover:bg-red-600 text-sm"
                                onClick={() => handleRemoveDataset(index)} // Use the new handler
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Newsletter subscription */}
            <div className="space-y-4 mx-2">
                <SubscriptionForm />
            </div>
        </div>
    );
};

export default SidebarItems;