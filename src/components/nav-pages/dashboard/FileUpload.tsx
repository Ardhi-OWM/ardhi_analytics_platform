import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-500 text-center my-2 w-full max-w-lg h-35 p-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">Drag & drop or file here or click to upload</p>
      </div>
    </div>
  );
};

export default FileUpload;
