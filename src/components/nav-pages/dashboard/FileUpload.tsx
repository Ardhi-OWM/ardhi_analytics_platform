import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, accept }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const inputProps = getInputProps();

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        {...getRootProps()}
        className="border border-dashed border-blue-500 text-center my-3 w-full max-w-lg h-35 p-4 
                   flex items-center justify-center bg-gray-200/[0.25] hover:bg-gray-300 transition-all duration-300 rounded-lg"
      >
        <input {...inputProps} accept={accept} />
        <p className="text-xs text-gray-500 dark:text-gray-400 ibm-plex-mono-regular-italic">
          Drag & drop or click to upload
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
