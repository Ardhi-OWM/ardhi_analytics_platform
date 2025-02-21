"use client";
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import apiClient from "@/lib/apiClient";
import { extractProviderAndRegion } from "@/lib/providers"; // ✅ Import function

interface ModelDataset {
    user_id?: string;
    type: "model" | "dataset";
    link: string;
}

const AddModelDataset = ({ onClose, onItemAdded }: {
    onClose: () => void;
    onItemAdded: (item: ModelDataset) => void
}) => {
    const { user } = useUser();
    const [newItem, setNewItem] = useState<ModelDataset>({
        type: 'model',
        link: '',
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    const insertModelDataset = async () => {
        if (!user) {
            showNotification('error', "You need to be logged in to add a model or dataset.");
            return;
        }
        if (!newItem.link) {
            showNotification('error', 'Please enter a valid link.');
            return;
        }
    
        setLoading(true);
    
        // ✅ Extract provider and region
        const { provider, region } = extractProviderAndRegion(newItem.link);
    
        try {
            const payload = {
                user_id: user.id,  
                type: newItem.type,
                link: newItem.link, 
                provider: provider || "Unknown", 
                region: region || "Unknown", 
            };
            
    
            const response = await apiClient.post("/models-datasets/", payload);
            const savedItem = response.data as ModelDataset;
    
            showNotification('success', 'Model/Dataset added successfully!');
            onItemAdded(savedItem);
            setNewItem({ type: 'model', link: '' });
            onClose();
    
        } catch (error: unknown) {
            console.error('Error adding model/dataset:', error);
            let errorMessage = 'Failed to add model/dataset. Please try again.';
    
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { detail?: string; error?: string } } };
                errorMessage = axiosError.response?.data?.detail || axiosError.response?.data?.error || errorMessage;
            }
    
            showNotification('error', errorMessage);
        }
    
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 w-1/2">
                <h2 className="text-xl mb-4 roboto-mono-semibold">Add Model or Dataset</h2>
                {notification && (
                    <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {notification.message}
                    </div>
                )}
                <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'model' | 'dataset' })}
                    className="w-full border border-purple-300 rounded p-2 mb-4 text-sm"
                >
                    <option value="model">Model</option>
                    <option value="dataset">Dataset</option>
                </select>
                <input
                    type="url"
                    placeholder="Enter a valid link"
                    value={newItem.link}
                    onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
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
                        onClick={insertModelDataset}
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

export default AddModelDataset;
