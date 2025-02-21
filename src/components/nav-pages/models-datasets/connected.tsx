"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; 
import AddModelDataset from './AddModelDataset';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ButtonMine from "@/components/reusable/button-mine";
import apiClient from '@/lib/apiClient';
import { datasetExtensions, modelExtensions } from "@/lib/extensions"
import { extractProviderAndRegion } from '@/lib/providers';


interface ModelDataset {
    id?: number;
    user_id: string;
    type: "model" | "dataset";
    provider: string;
    region: string;
    link: string;
    created_at?: string;
}

// // Allowed dataset and model file extensions
// const datasetExtensions = ['.csv', '.xls', '.xlsx', '.json', '.geojson', '.tiff', '.shp', '.nc'];
// const modelExtensions = ['.h5', '.onnx', '.pb', '.tflite', '.pkl', '.sav', '.rds'];

// Function to check if a link is valid
const isValidURL = (url: string) => {
    try {
        new URL(url);
        return url.startsWith("https://") || url.startsWith("http://");
    } catch {
        return false;
    }
};

// Function to check if the link is a valid dataset or model
const isValidModelDatasetLink = (url: string, type: "model" | "dataset") => {
    if (!isValidURL(url)) return false;
    const lowerUrl = url.toLowerCase();
    const validExtensions = type === "dataset" ? datasetExtensions : modelExtensions;
    return validExtensions.some(ext => lowerUrl.endsWith(ext));
};

const ConnectedModelDatasets = () => {
    const { user } = useUser(); 
    const [items, setItems] = useState<ModelDataset[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;
        const storedItems = localStorage.getItem("models_datasets");
        if (storedItems) {
            const parsedItems = JSON.parse(storedItems);
            setItems(parsedItems);
        }
    }, [user]);
    
    const addItem = async (newItem: ModelDataset) => {
        if (!user || isSubmitting) return;

        if (!isValidModelDatasetLink(newItem.link, newItem.type)) {
            alert(`Invalid ${newItem.type} link. Please provide a valid dataset or model URL.`);
            return;
        }

        setIsSubmitting(true);

        const { provider, region } = extractProviderAndRegion(newItem.link);
        const updatedItem = { ...newItem, user_id: user.id, provider, region };

        try {
            const updatedItems = [...items, updatedItem];
            setItems(updatedItems);
            localStorage.setItem("models_datasets", JSON.stringify(updatedItems));

            alert('Model/Dataset added successfully!');
        } catch (error) {
            console.error("Error adding model/dataset:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteItem = async (id?: number) => {
        if (!confirm("Are you sure you want to delete this model/dataset?")) return;
        if (!user || !id) return;
    
        try {
            const response = await apiClient.request({
                url: '/models-datasets/delete_by_id/',
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                data: { id }
            });
    
            if (response.status === 204) {
                const updatedItems = items.filter((item) => item.id !== id);
                setItems(updatedItems);
                localStorage.setItem("models_datasets", JSON.stringify(updatedItems));
    
                alert("Model/Dataset deleted successfully!");
            } else {
                alert("Failed to delete model/dataset from backend.");
            }
        } catch (error) {
            console.error("Error deleting model/dataset:", error);
            alert("Failed to delete model/dataset. Please try again.");
        }
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="w-full flex flex-col ">
            <h1 className="text-2xl ubuntu-mono-bold mb-4">Connected Models and Datasets</h1>

            <div className="flex justify-center w-1/2 md:w-1/4 my-6">
                <ButtonMine
                    href={undefined}
                    className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight"
                    onClick={() => setIsModalOpen(true)}
                    white={false}
                    px={4}
                >
                    <span className="hover:text-green-600 hover:underline "> Add Model or Dataset </span>
                </ButtonMine>
            </div>

            {isModalOpen && (
                <AddModelDataset
                    onClose={() => setIsModalOpen(false)}
                    onItemAdded={(item) => {
                        const { provider, region } = extractProviderAndRegion(item.link);
                        const updatedItem: ModelDataset = {
                            ...item,
                            user_id: user?.id ?? '', 
                            provider,
                            region
                        };
                        addItem(updatedItem);
                    }}
                />
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Storage Location</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id || index}>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.provider}</TableCell>
                            <TableCell>{item.region}</TableCell>
                            <TableCell className="text-sm text-blue-500 underline ibm-plex-mono-regular-italic">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {item.link}
                                </a>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(item.created_at)}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="bg-red-400 px-4 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ConnectedModelDatasets;
