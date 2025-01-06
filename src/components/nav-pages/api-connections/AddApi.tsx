"use client";
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

interface Service {
    id?: number;
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

const AddApi = ({ onClose, onServiceAdded }: { onClose: () => void; onServiceAdded: (service: Service) => void }) => {
    const [apiUrl, setApiUrl] = useState('');
    const [newService, setNewService] = useState<Service>({
        name: '',
        provider: '',
        type: '',
        region: '',
        apiUrl: '',
    });
    const [loading, setLoading] = useState(false);

    //  ----------Parse the API URL and extract name, provider, and region----------
    const parseApiUrl = (url: string) => {
        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                throw new Error('Invalid URL format');
            }

            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // Extract the name from the subdomain
            const name = hostname.split('.')[0]; // First part of the subdomain

            // Extract the provider
            const provider =
                hostname.includes('amazonaws') ? 'AWS' :
                    hostname.includes('core.windows') ? 'Azure' :
                        hostname.includes('cloud-object-storage') ? 'IBM Cloud' :
                            hostname.includes('digitaloceanspaces') ? 'DigitalOcean' :
                                'Unknown';

            // Extract the region
            const parts = hostname.split('.');
            const region = urlObj.searchParams.get('region') ||
                parts.find(part => part.match(/[a-z]{2,3}-[a-z]+-\d/)) ||
                'Unknown';

            // Update the newService state
            setNewService({
                ...newService,
                apiUrl: url,
                provider,
                region,
                name, // Set the extracted name
                type: 'Cloud Storage'
            });
        } catch (error) {
            console.error('Invalid URL format', error);
        }
    };
    //  -------------- ------------------------------------------ -------------
    //  -------------- Insert Service into Supabase and Close Modal -------------
    const insertService = async () => {
        setLoading(true);
        try {
            const { data: existingData, error: existingError } = await supabase
                .from('services')
                .select('*')
                .eq('apiUrl', newService.apiUrl);

            if (existingError) {
                console.error('Error checking for existing URL:', existingError.message);
                setLoading(false);
                return;
            }

            if (existingData.length > 0) {
                alert('This API URL already exists in the database.');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('services')
                .insert([newService])
                .select('*');

            if (error) {
                console.error('Error inserting data:', error.message);
            } else if (data) {
                alert('Service added successfully!');
                onServiceAdded(data[0]);
                setNewService({ name: '', provider: '', type: '', region: '', apiUrl: '' });
                setApiUrl('');
                onClose();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
        setLoading(false);
    };
    //  -------------- ------------------------------------------ -------------

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 w-1/2 ">
                <h2 className="text-xl mb-4 roboto-mono-semibold">Add API Endpoint</h2>
                <input
                    type="text"
                    placeholder="Enter API URL"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    onBlur={() => parseApiUrl(apiUrl)}
                    required
                    className="w-full ibm-plex-mono-regular-italic border border-gray-300 rounded p-2 mb-4 text-sm"
                />
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={insertService}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
