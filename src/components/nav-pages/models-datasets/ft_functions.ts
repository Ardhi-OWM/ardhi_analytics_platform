"use client";
import { useEffect } from 'react';
import { SetStateAction } from 'react';

interface ModelDataset {
    id?: number;
    user_id: string;
    name: string;
    type: "model" | "dataset";
    provider: string;
    region: string;
    location: string;
    link: string; 
    created_at?: string;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const fetchData = async (userId: string): Promise<ModelDataset[]> => {
    const storedItems = localStorage.getItem("models_datasets");
    const items: ModelDataset[] = storedItems ? JSON.parse(storedItems) : [];
    return items.filter(item => item.user_id === userId);
};

export const addItem = async (
    item: Omit<ModelDataset, 'id'>,
    userId: string,
    setItems: React.Dispatch<SetStateAction<ModelDataset[]>>,
    setIsSubmitting: React.Dispatch<SetStateAction<boolean>>
) => {
    if (!userId) return;
    setIsSubmitting(true);

    try {
        const storedItems = localStorage.getItem("models_datasets");
        const existingItems: ModelDataset[] = storedItems ? JSON.parse(storedItems) : [];

        if (existingItems.some(i => i.location === item.location || i.link === item.link)) {
            alert("This model/dataset already exists.");
            setIsSubmitting(false);
            return;
        }

        const newItem = { ...item, id: Date.now() };
        const updatedItems = [...existingItems, newItem];
        localStorage.setItem("models_datasets", JSON.stringify(updatedItems));

        alert("Model/Dataset added successfully!");
        setItems(updatedItems);
    } catch (error) {
        console.error("Error adding model/dataset:", error);
    } finally {
        setIsSubmitting(false);
    }
};

export const deleteItem = async (
    id: number,
    userId: string,
    setItems: SetState<ModelDataset[]>
) => {
    if (!confirm("Are you sure you want to delete this model/dataset?")) return;
    if (!userId) return;

    try {
        const storedItems = localStorage.getItem("models_datasets");
        const existingItems: ModelDataset[] = storedItems ? JSON.parse(storedItems) : [];

        const updatedItems = existingItems.filter(item => item.id !== id);
        localStorage.setItem("models_datasets", JSON.stringify(updatedItems));

        alert("Model/Dataset deleted successfully!");
        setItems(updatedItems);
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};

export const useItemSubscription = (userId: string, setItems: SetState<ModelDataset[]>) => {
    useEffect(() => {
        if (!userId) return;

        const fetchItems = async () => {
            const items = await fetchData(userId);
            setItems(items);
        };

        fetchItems();
    }, [userId, setItems]);
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};
