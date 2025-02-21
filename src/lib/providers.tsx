const PROVIDERS = [
    { name: "AWS S3", hostname: "s3.amazonaws.com" },
    { name: "Google Cloud Storage", hostname: "storage.googleapis.com" },
    { name: "Google Cloud Storage", hostname: "storage.cloud.google" },
    { name: "Azure Blob Storage", hostname: "blob.core.windows.net" },
    { name: "IBM Cloud Object Storage", hostname: "s3.us.cloud-object-storage.appdomain.cloud" },
    { name: "DigitalOcean Spaces", hostname: "digitaloceanspaces.com" },
    { name: "Oracle Cloud Object Storage", hostname: "objectstorage.oraclecloud.com" },
    { name: "Alibaba Cloud OSS", hostname: "oss.aliyuncs.com" },
    { name: "Wasabi Cloud Storage", hostname: "s3.wasabisys.com" },
    { name: "Backblaze B2", hostname: "f000.backblazeb2.com" },
    { name: "MinIO (Self-Hosted)", hostname: "minio.yourdomain.com" },
    
    // ✅ Model Hosting Providers
    { name: "Hugging Face Model Hub", hostname: "huggingface.co" },
    { name: "TensorFlow Hub", hostname: "tfhub.dev" },
    { name: "ONNX Model Zoo", hostname: "onnxruntime.ai" },
    { name: "Google AI Model Garden", hostname: "ai.google.com" },
    { name: "PyTorch Hub", hostname: "pytorch.org" },
    { name: "Microsoft AI Model Gallery", hostname: "microsoft.com" },
    { name: "NVIDIA NGC", hostname: "ngc.nvidia.com" }
];

/**
 * Extracts the provider name and region from a given URL.
 * @param {string} url - The URL to analyze.
 * @returns {{ provider: string, region: string }} - The provider and region extracted.
 */
export const extractProviderAndRegion = (url: string): { provider: string; region: string } => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Find a matching provider
        const providerData = PROVIDERS.find(provider => hostname.includes(provider.hostname));
        const provider = providerData ? providerData.name : "Unknown";

        // Extract region from subdomain or path pattern
        const regionMatch = hostname.match(/[a-z]{2,3}-[a-z]+-\d/);
        const region = regionMatch?.[0] || "Unknown";

        return { provider, region };
    } catch {
        return { provider: "Unknown", region: "Unknown" };
    }
};

export default PROVIDERS;
