import React, { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";

export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: string | Accept; 
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, accept }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) onFileUpload(file);
    },
    [onFileUpload]
  );

  const normalizedAccept: Accept | undefined =
    typeof accept === "string" ? { [accept]: [] } : accept;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: normalizedAccept,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        {...getRootProps()}
        className="w-full max-w-lg p-4 h-35 border border-dashed border-blue-500 rounded-lg 
                   bg-gray-200/[0.25] hover:bg-gray-300 transition-all duration-300 
                   flex items-center justify-center text-center my-3"
      >
        <input {...getInputProps()} />
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Drag & drop or click to upload
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
