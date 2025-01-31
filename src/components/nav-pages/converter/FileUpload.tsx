"use client";
import * as React from "react";
import { CloudUpload, X, RefreshCw } from 'lucide-react';
import { FileType } from "@/utils/types";

interface FileUploadProps {
    onFileSelect: (file: FileType) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = React.useState<FileType | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files ? event.target.files[0] : null;
    
        if (file) {
            const newFile = {
                file,
                name: file.name,
                size: file.size,
                progress: 0,
                uploaded: false
            } as FileType; 
    
            setSelectedFile(newFile);
            simulateFileUpload(newFile);
            onFileSelect(newFile); // Pass the full FileType object
        }
    };
    
    

    const simulateFileUpload = (file: FileType) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setSelectedFile(prev =>
                prev && prev.name === file.name
                    ? { ...prev, progress }
                    : prev
            );
            if (progress >= 100) {
                clearInterval(interval);
                setSelectedFile(prev =>
                    prev && prev.name === file.name
                        ? { ...prev, uploaded: true, error: Math.random() > 0.8 }
                        : prev
                );
            }
        }, 500);
    };

    const triggerFileUpload = () => fileInputRef.current?.click();
    const resetUpload = () => setSelectedFile(null);

    const getProgressBarColor = () => {
        if (!selectedFile) return "bg-gray-300";
        if (selectedFile.error) return "bg-red-500";
        if (selectedFile.uploaded) return "bg-green-500";
        return "bg-blue-500";
    };

    return (
        <div className="flex justify-center items-center flex-col">
            <div
                className="flex flex-col justify-center items-center border border-dashed border-purple-300 rounded h-48 w-96 cursor-pointer"
                onClick={triggerFileUpload}
            >
                <CloudUpload className="h-24 w-24 text-purple-500" />
                <p className="text-purple-500 ibm-plex-mono-semibold-italic">Import your file</p>
                <p className="text-gray-500">Click or drag and drop a file here</p>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
            />

            {selectedFile && (
                <div className="mt-6 w-96 border p-4 rounded-lg shadow-md ">
                    <div className="flex justify-between items-center ">
                        <p className="text-base font-semibold">{selectedFile.name}</p>
                        {selectedFile.error ? (
                            <RefreshCw className="text-red-500 cursor-pointer" onClick={resetUpload} />
                        ) : (
                            <X className="text-gray-500 cursor-pointer" onClick={resetUpload} />
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                            style={{ width: `${selectedFile.progress}%` }}>
                        </div>
                    </div>
                    <p className="text-right text-sm mt-1 ">
                        {selectedFile.progress}% {selectedFile.uploaded && !selectedFile.error ? "✅ Completed" : ""}
                    </p>
                    {selectedFile.error && (
                        <p className="text-red-500 text-sm mt-2">Error occurred. Try again.</p>
                    )}
                </div>
            )}
        </div>
    );
}
