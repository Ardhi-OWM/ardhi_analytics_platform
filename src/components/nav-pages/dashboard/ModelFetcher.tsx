import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth, useUser } from "@clerk/clerk-react";

const ModelFetcher: React.FC<{ setModels: (models: any[]) => void }> = ({ setModels }) => {
    const { user } = useUser(); // Get user object
    const userId = user?.id; // Fetch user ID

    useEffect(() => {
        const fetchModels = async () => {
            if (!userId) return;
            try {
                const response = await apiClient.get<{ models: any[] }>(`/inputs?user_id=${userId}`);
                setModels(response.data.models);
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };

        fetchModels();
    }, [userId, setModels]);

    return null;
};

export default ModelFetcher;
