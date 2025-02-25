import { useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { useUser } from "@clerk/clerk-react";

interface Model {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}

interface ApiResponse {
    models: Model[];
}

const ModelFetcher: React.FC<{ setModels: (models: Model[]) => void }> = ({ setModels }) => {
    const { user } = useUser();
    const userId = user?.id;

    useEffect(() => {
        const fetchModels = async () => {
            if (!userId) return;
            try {
                const response = await apiClient.get<ApiResponse>(`/inputs?user_id=${userId}`);
                setModels(response.data.models);
            } catch (error: unknown) {
                console.error("Error fetching models:", error instanceof Error ? error.message : "Unknown error");
            }
        };

        fetchModels();
    }, [userId, setModels]);

    return null;
};

export default ModelFetcher;
