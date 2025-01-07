"use client";
import * as React from "react";
import { Divider } from "@nextui-org/divider";
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { fileFormats } from '@/components/constants';
import FileUpload from './FileUpload';

export default function ConverterPage() {
    const handleFileSelect = (file: any) => {
        console.log("File received in parent:", file);
    };

    return (
        <div className='w-full'>
            {/* Header Section */}
            <div className="my-6 mx-8 border-b border-gray-200/[0.25]  p-2">
                <Divider className="mb-4" />
                <h1 className="text-4xl text-gray-500 roboto-mono-bold">
                    Convert Data
                </h1>
                <Divider className="my-4" />
                <h3 className="text-xl text-gray-500 ">
                    Select a file to Convert to a different format
                </h3>
                <Divider className="my-2" />
                <p>
                    We support many different file formats. Choose the format that best matches the way you will use the data.
                </p>
            </div>

            {/* File Upload Component */}
            <FileUpload onFileSelect={handleFileSelect} />

            {/* File Format Select Component */}
            <div className="my-6 mx-8">
                <Select>
                    <div>
                        <h3 className="text-base text-gray-500 font-bold">Choose the Output to Convert</h3>
                    </div>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>File Formats</SelectLabel>
                            {fileFormats.map((format) => (
                                <SelectItem
                                    key={format.value}
                                    value={format.value}>
                                    {format.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
