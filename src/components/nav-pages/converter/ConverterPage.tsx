"use client";
import * as React from "react";
import * as GeoTIFF from "geotiff";
import { Divider } from "@nextui-org/divider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fileFormats } from '@/components/constants';
import FileUpload from './FileUpload';
import { FileType } from "@/utils/types";




export default function ConverterPage() {
    const [selectedFormat, setSelectedFormat] = React.useState("");
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [convertedFile, setConvertedFile] = React.useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [allowedFormats, setAllowedFormats] = React.useState<string[]>([]);

    const conversionMap: Record<string, string[]> = {
        "json": ["geojson", "csv", "xml", "txt", "md"],
        "geojson": ["csv", "xml", "txt", "md"],
        "csv": ["json", "geojson", "xml", "txt", "md"],
        "xml": ["json", "geojson", "csv", "txt", "md"],
        "kml": ["json", "geojson", "csv", "txt", "md"],
        "gpx": ["json", "geojson", "csv", "txt", "md"],
        "tif": ["json", "geojson"],
        "txt": ["json", "geojson", "csv"],
        "md": ["json", "geojson", "csv"]
    };


    const handleFileSelect = (fileObj: FileType) => {
        if (fileObj?.file instanceof File) {
            setUploadedFile(fileObj.file);
            setOriginalFileName(fileObj.file.name.split('.').slice(0, -1).join('.'));
            setErrorMessage("");

            const fileExtension = fileObj.file.name.split('.').pop()?.toLowerCase();
            if (fileExtension && conversionMap[fileExtension]) {
                setAllowedFormats(conversionMap[fileExtension]);
            } else {
                setAllowedFormats([]);
            }
        } else {
            console.error("Invalid file type received:", fileObj);
        }
    };

    const handleFormatChange = (format: string) => {
        setSelectedFormat(format);
        setErrorMessage("");
    };

    const convertFile = async () => {
        if (!uploadedFile) {
            setErrorMessage("Please upload a file before converting.");
            return;
        }

        if (!selectedFormat) {
            setErrorMessage(" Please choose an output format.");
            return;
        }


        let fileContent = "";

        try {
            const fileText = await uploadedFile.text();
            const parsedContent = await parseFileContent(uploadedFile.name, fileText, uploadedFile);

            if (selectedFormat === "json") {
                fileContent = JSON.stringify(parsedContent, null, 2);
            } else if (selectedFormat === "geojson") {
                fileContent = convertToGeoJSON(parsedContent);
            } else if (selectedFormat === "csv") {
                fileContent = convertToCSV(parsedContent);
            } else if (selectedFormat === "xml") {
                fileContent = convertToXML(parsedContent);
            } else if (selectedFormat === "txt" || selectedFormat === "md") {
                fileContent = Array.isArray(parsedContent) ? parsedContent.join("\n") : JSON.stringify(parsedContent, null, 2);
            } else {
                setErrorMessage(" Unsupported file format.");
                return;
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Error processing file.");
            return;
        }


        const convertedBlob = new Blob([fileContent], { type: selectedFormat === "geojson" ? "application/geo+json" : "text/plain" });
        const fileURL = URL.createObjectURL(convertedBlob);

        setConvertedFile(fileURL);
    };


    const downloadFile = () => {
        if (!convertedFile || !selectedFormat) return;
        const newFileName = `${originalFileName}.${selectedFormat}`;
        const link = document.createElement("a");
        link.href = convertedFile;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const parseFileContent = async (fileName: string, fileText: string, file: File) => {
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        switch (fileExtension) {
            case "json":
            case "geojson":
                const parsedJSON = JSON.parse(fileText);
                return parsedJSON.type === "FeatureCollection" ? parsedJSON.features.map((f: GeoJSONFeature) =>
                    f.properties) : parsedJSON;
            case "csv":
                return parseCSV(fileText);
            case "xml":
            case "kml":
            case "gpx":
                return parseXML(fileText);
            case "tif":
                return await parseGeoTIFF(file);
            case "txt":
            case "md":
                return fileText.split("\n").map(line => line.trim());
            default:
                throw new Error("Unsupported file format.");
        }
    };

    // -----------------------------------------------------------
    // -------------------------  parse CSV ---------------------
    const parseCSV = (text: string): Array<Record<string, string>> => {
        const [headerLine, ...lines] = text.split("\n").map(line => line.trim()).filter(line => line);
        const headers = headerLine.split(",");
        return lines.map(line => {
            const values = line.split(",");
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || "";
                return obj;
            }, {} as Record<string, string>);
        });
    };

    // ----------------------------------------------------------------
    // -------------------------  Convert to  CSV ---------------------
    const convertToCSV = (data: unknown): string => {
        if (!data || typeof data !== "object") {
            throw new Error("Invalid data for CSV conversion.");
        }

        let rows: Record<string, unknown>[] = [];

        if ((data as { type: string; features: GeoJSONFeature[] }).type === "FeatureCollection" && Array.isArray((data as { type: string; features: GeoJSONFeature[] }).features)) {
            rows = (data as { features: GeoJSONFeature[] }).features.map((feature: GeoJSONFeature) => feature.properties);
        } else if (Array.isArray(data)) {
            rows = data;
        } else {
            throw new Error("Unsupported data format for CSV conversion.");
        }

        if (rows.length === 0) {
            throw new Error("No data available for CSV conversion.");
        }

        const headers = Object.keys(rows[0]);
        const csvContent = rows
            .map((row) => headers.map((header) => row[header] || "").join(","))
            .join("\n");

        return `${headers.join(",")}\n${csvContent}`;
    };

    // -----------------------------------------------------------
    // ------------- GeoJSON Feature interface --------------------
    interface GeoJSONFeature {
        properties: Record<string, unknown>;
        geometry?: unknown;
    }

    const convertToGeoJSON = (data: GeoJSONFeature[]): string => {
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format for GeoJSON conversion.");
        }
        const geojson = {
            type: "FeatureCollection",
            features: data.map((row) => ({
                type: "Feature",
                properties: row.properties,
                geometry: row.geometry || null
            }))
        };
        return JSON.stringify(geojson, null, 2);
    };

    // ----------------------------------------------------------------
    // -------------------------  Parse GeoTIFF ---------------------

    const parseGeoTIFF = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage();
        const rasterData = await image.readRasters();

        return {
            width: image.getWidth(),
            height: image.getHeight(),
            bbox: image.getBoundingBox(),
            data: rasterData
        };
    };

    // ----------------------------------------------------------------
    // -------------------------  Parse XML ---------------------
    const parseXML = (text: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        return xmlToJson(xmlDoc);
    };

    // ----------------------------------------------------------------
    // -------------------------  xml To Json  ---------------------

    const xmlToJson = (xml: Node): Record<string, unknown> => {
        const obj: Record<string, unknown> = {};

        if (xml.nodeType === Node.ELEMENT_NODE) {
            const element = xml as Element;
            if (element.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let j = 0; j < element.attributes.length; j++) {
                    const attribute = element.attributes.item(j);
                    if (attribute) {
                        const attr = attribute as Attr;
                        (obj["@attributes"] as Record<string, string>)[attr.nodeName] = attr.nodeValue || "";
                    }
                }
            }
        } else if (xml.nodeType === Node.TEXT_NODE) {
            obj["_text"] = xml.nodeValue?.trim() || "";
        }

        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                const item = xml.childNodes.item(i);
                if (!item) continue;

                const nodeName = item.nodeName;
                if (!obj[nodeName]) {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    (obj[nodeName] as unknown[]).push(xmlToJson(item));
                }
            }
        }

        return obj;
    };

    const convertToXML = (data: Record<string, unknown>) => {
        const jsonToXml = (obj: Record<string, unknown> | unknown[], rootName: string) => {
            let xml = "";
            if (typeof obj === "object") {
                for (const key in obj) {
                    if (Array.isArray((obj as Record<string, unknown>)[key])) {
                        (obj as Record<string, unknown[]>)[key].forEach((value: unknown) => {
                            const subObj = value as Record<string, unknown>;
                            xml += `<${key}>${jsonToXml(subObj, "")}</${key}>`;
                        });
                    } else {
                        const value = (obj as Record<string, unknown>)[key];
                        xml += `<${key}>${jsonToXml(value as Record<string, unknown> | unknown[], "")}</${key}>`;
                    }
                }
            } else {
                xml += obj;
            }
            return rootName ? `<${rootName}>${xml}</${rootName}>` : xml;
        };
        return jsonToXml(data, "root");
    };

    return (
        <div className="w-full min-h-screen mx-8 flex flex-col items-center">
            <div className="border-b border-gray-200/[0.25] p-2 my-6 text-center">
                <Divider className="mb-4" />
                <h1 className="text-4xl text-gray-700 font-semibold">Convert Your Data</h1>
                <Divider className="my-4" />
                <h3 className="text-xl text-gray-600">Upload a file and choose a format to convert it into.</h3>
                <Divider className="my-2" />
                <p className="text-gray-500">We support many different file formats for geospatial and tabular data. Choose the format that best matches the way you will use the data.</p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} />

            <div className="mt-6 w-[320px] text-center">
                <h3 className="text-lg text-gray-600 font-medium mb-2">Select Output Format</h3>
                <Select onValueChange={handleFormatChange}>
                    <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400">
                        <SelectValue placeholder="Choose format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Available Formats</SelectLabel>
                            {fileFormats
                                .filter((format) => allowedFormats.includes(format.value)) // ONLY show allowed formats
                                .map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {/* Show error message if no format is selected */}
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                {selectedFormat && (
                    <p className="text-sm mt-2 text-gray-600">
                        Selected Format: <strong>{selectedFormat}</strong>
                    </p>
                )}

                <button
                    onClick={convertFile}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    disabled={!uploadedFile}
                >
                    Convert File
                </button>

                {convertedFile && (
                    <button
                        onClick={downloadFile}
                        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Download Converted File
                    </button>
                )}
            </div>
        </div>
    );
}