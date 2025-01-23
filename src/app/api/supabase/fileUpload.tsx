import React, { useState } from 'react';
import { handleFileUpload } from '@/lib/awsS3';

const FileUploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await handleFileUpload(file);
            alert('File uploaded successfully!');
        } catch (error) {
            alert('File upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1>Upload a File</h1>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={uploadFile} disabled={uploading || !file}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default FileUploadPage;
