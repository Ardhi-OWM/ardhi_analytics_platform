import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

interface UploadFileInput {
    type: string;
    name: string;
    [key: string]: any;
}

const allowedFileTypes = [
    'application/json',
    'text/csv',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/tiff',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/x-msvideo',
    'video/mpeg',
    'video/webm',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'application/vnd.geo+json',
    'application/x-tar',
    'application/zip',
    'application/octet-stream',
    'application/x-shapefile',
    'application/x-rar-compressed',
];

/**
 * Validate file type.
 */
function validateFile(file: UploadFileInput): void {
    if (!allowedFileTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Allowed types: GeoTIFF, CSV, GeoJSON.');
    }
}

/**
 * Upload a file directly to S3.
 */
export async function uploadFile(file: UploadFileInput, key: string): Promise<AWS.S3.ManagedUpload.SendData> {
    validateFile(file);
    const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: file.type,
    };

    return s3.upload(params).promise();
}

/**
 * Download a file from S3.
 */
export async function downloadFile(key: string): Promise<AWS.S3.GetObjectOutput> {
    const params: AWS.S3.GetObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    };

    return s3.getObject(params).promise();
}

/**
 * Generate a pre-signed URL for secure S3 operations.
 */
export function generatePresignedUrl(key: string, operation: 'putObject' | 'getObject' = 'putObject'): Promise<string> {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Expires: 60 * 60, 
    };

    return s3.getSignedUrlPromise(operation, params);
}

/**
 * Handle file upload via pre-signed URL.
 */
export async function handleFileUpload(file: UploadFileInput): Promise<void> {
    try {
        validateFile(file);
        const uploadUrl = await generatePresignedUrl(`uploads/${file.name}`, 'putObject');
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });
        console.log('File uploaded successfully');
    } catch (error) {
        console.error('File upload failed:', error);
        throw error;
    }
}
