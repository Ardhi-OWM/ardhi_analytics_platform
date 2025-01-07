"use client";
import * as React from "react";
import { Divider } from "@nextui-org/divider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fileFormats } from '@/components/constants';
import FileUpload from './FileUpload';
import { FileType } from './types'; // Import from the shared types file

export default function ConverterPage() {
    const [selectedFormat, setSelectedFormat] = React.useState("");

    const handleFileSelect = (file: FileType) => {
        console.log("File received in parent:", file);
    };

    const handleFormatChange = (format: string) => {
        setSelectedFormat(format);
        console.log("Selected Format:", format);
    };

    return (
        <div className="w-full min-h-screen mx-8">
            {/* Header Section */}
            <div className=" border-b border-gray-200/[0.25] p-2 my-6">
                <Divider className="mb-4" />
                <h1 className="text-4xl text-gray-500 roboto-mono-bold">Convert Data</h1>
                <Divider className="my-4" />
                <h3 className="text-xl text-gray-500 ">Select a file to Convert to a different format</h3>
                <Divider className="my-2" />
                <p>We support many different file formats. Choose the format that best matches the way you will use the data.</p>
            </div>

            {/* File Upload Component */}
            <FileUpload onFileSelect={handleFileSelect} />

            {/* File Format Select Component */}
            <div className="mt-8 flex flex-col items-center justify-center">
                 {/* File Upload Component */}
                <Select onValueChange={handleFormatChange}>
                    <div>
                        <h3 className="text-base text-gray-500 font-bold my-4">Choose the Output to Convert</h3>
                    </div>
                    <SelectTrigger className="w-[280px] focus:ring-2 focus:ring-purple-400">
                        <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup className="bg-white dark:bg-slate-900">
                            <SelectLabel>File Formats</SelectLabel>
                            {fileFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value} className="hover:bg-gray-100/[0.5]">
                                    {format.label}
                                </SelectItem>
                            ))}
                            <SelectItem value="request-new-format">Request a new format</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {/* Display the selected format */}
                {selectedFormat && (
                    <p className="text-sm mt-2 text-gray-600">
                        Selected Format: <strong>{selectedFormat}</strong>
                    </p>
                )}
            </div>
        </div>
    );
}
