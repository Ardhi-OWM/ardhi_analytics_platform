"use client";
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";  
import apiClient from "@/lib/apiClient"; 

interface Service {
    user_id?: string;
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
}

const AddApi = ({ onClose, onServiceAdded }: {
    onClose: () => void;
    onServiceAdded: (service: Service) => void
}) => {
    const { user } = useUser();
    const [apiUrl, setApiUrl] = useState('');
    const [newService, setNewService] = useState<Service>({
        name: '',
        provider: '',
        type: 'API',
        region: '',
        apiUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    const parseApiUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            const name = hostname.split('.')[0];
            const provider =
                hostname.includes('amazonaws') ? 'AWS' :
                hostname.includes('core.windows') ? 'Azure' :
                hostname.includes('googleapis') ? 'Google Cloud' :
                hostname.includes('digitaloceanspaces') ? 'DigitalOcean' :
                'Unknown';

            const regionMatch = hostname.match(/[a-z]{2,3}-[a-z]+-\d/);
            const region = regionMatch?.[0] || 'Unknown';

            setNewService({
                name,
                provider,
                type: 'API',
                region,
                apiUrl: url,
            });
        } catch (error) {
            showNotification('error', 'Invalid URL format. Please enter a valid URL.');
        }
    };

    const insertService = async () => {
        if (!user) {
            showNotification('error', "You need to be logged in to add an API.");
            return;
        }
        if (!newService.apiUrl) {
            showNotification('error', 'Please enter a valid API URL.');
            return;
        }
    
        setLoading(true);
        try {
            const payload = {
                user_id: user.id,
                name: newService.name,
                provider: newService.provider,
                region: newService.region,
                api_url: newService.apiUrl,
                type: newService.type,
            };
    
            const response = await apiClient.post("/api-endpoints/", payload);
            const savedService = response.data as Service;
    
            showNotification('success', 'Service added successfully!');
            onServiceAdded(savedService);
            setNewService({ name: '', provider: '', type: 'API', region: '', apiUrl: '' });
            setApiUrl('');
            onClose();
    
        } catch (error: any) {
            console.error('Error adding service:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Failed to add service. Please try again.';
            showNotification('error', errorMessage);
        }
    
        setLoading(false);
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 w-1/2">
                <h2 className="text-xl mb-4 roboto-mono-semibold">Add API Endpoint</h2>
                {notification && (
                    <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {notification.message}
                    </div>
                )}
                <label htmlFor="api-url" className="sr-only">API URL</label>
                <input
                    id="api-url"
                    type="url"
                    placeholder="Enter API URL"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    onBlur={() => parseApiUrl(apiUrl)}
                    required
                    className="w-full border border-purple-300 rounded p-2 mb-4 text-sm"
                />
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={insertService}
                        className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddApi;
