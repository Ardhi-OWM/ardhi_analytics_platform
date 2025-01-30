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
    <div className='flex flex-col items-center justify-center'>
      <div {...getRootProps()}
        // style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}
        className='border border-dashed border-purple-300  text-center my-2 w-4/5'
      >
        <input {...getInputProps()} />
        <p className='text-xs'>Drag & drop file or click to select </p>
      </div>
    </div>

  );
};

export default FileUpload;