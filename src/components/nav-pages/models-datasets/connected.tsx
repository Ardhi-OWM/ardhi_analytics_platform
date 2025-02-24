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

const isValidURL = (url: string) => {
    try {
        new URL(url);
        return url.startsWith("https://") || url.startsWith("http://");
    } catch {
        return false;
    }
};

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
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "model" | "dataset">("all");

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

    const filteredItems = items.filter((item) => {
        const search = searchTerm.trim().toLowerCase(); 

       const provider = item.provider?.toLowerCase() || "";
        const region = item.region?.toLowerCase() || "";
        const link = item.link?.toLowerCase() || "";
        const type = item.type?.toLowerCase() || "";

        const matchesSearch = 
            search === "" ||  
            provider.includes(search) || 
            region.includes(search) || 
            link.includes(search) ||
            type.includes(search);  

        const matchesType = filterType === "all" || item.type === filterType;

        return matchesSearch && matchesType;
    });

    return (
        <div className="w-full flex flex-col">
            <h1 className="text-2xl ubuntu-mono-bold mb-4">Connected Models and Datasets</h1>

            {/* Search Input */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by provider, region, or URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-lg"
                />
            </div>

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

            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                        <TableHead className="w-1/6 text-left">
                            <span>Type</span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as "all" | "model" | "dataset")}
                                className="ml-6 px-2 py-1 border border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800" // ✅ Darker border applied
                            >
                                <option value="all">All</option>
                                <option value="model">Model</option>
                                <option value="dataset">Dataset</option>
                            </select>
                        </TableHead>
                        <TableHead className="w-1/6 text-left">Provider</TableHead>
                        <TableHead className="w-1/6 text-left">Region</TableHead>
                        <TableHead className="w-1/4 text-left">Storage URL</TableHead>
                        <TableHead className="w-1/6 text-left">Created At</TableHead>
                        <TableHead className="w-1/6 text-left">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map((item, index) => (
                        <TableRow key={item.id || index} className="border-b border-gray-300">
                            <TableCell className="w-1/6">{item.type}</TableCell>
                            <TableCell className="w-1/6">{item.provider}</TableCell>
                            <TableCell className="w-1/6">{item.region}</TableCell>
                            <TableCell className="w-1/4 text-blue-500 underline">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.link}
                                </a>
                            </TableCell>
                            <TableCell className="w-1/6">{formatDate(item.created_at)}</TableCell>
                            <TableCell className="w-1/6">
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
