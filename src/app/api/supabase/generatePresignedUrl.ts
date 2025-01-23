import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize the S3 instance
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileKey, operation } = req.body;

    // Validate the fileKey and operation
    if (!fileKey || typeof fileKey !== 'string') {
        return res.status(400).json({ error: 'Invalid fileKey' });
    }

    if (!['putObject', 'getObject'].includes(operation)) {
        return res.status(400).json({ error: 'Invalid operation. Use "putObject" or "getObject"' });
    }

    // S3 parameters for generating the signed URL
    const params = {
        Bucket: process.env.S3_BUCKET_NAME, 
        Key: fileKey,
        Expires: 3600, 
    };

    try {
        const url = await s3.getSignedUrlPromise(operation, params);
        res.status(200).json({ url });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ error: 'Failed to generate pre-signed URL' });
    }
}
