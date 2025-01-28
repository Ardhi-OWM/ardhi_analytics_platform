"use client";
import { useEffect } from 'react';
import { SetStateAction } from 'react';

interface Service {
    id?: number;
    user_id: string;
    name: string;
    provider: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

// Typing the state setters correctly
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// ---------------- Fetch Services from LocalStorage ----------------
export const fetchData = async (userId: string): Promise<Service[]> => {
    const storedServices = localStorage.getItem("services");
    const services: Service[] = storedServices ? JSON.parse(storedServices) : [];
    return services.filter(service => service.user_id === userId);
};

// ---------------- Extract host and region from URL ----------------
export const parseApiUrl = (url: string) => {
    try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new Error('Invalid URL format');
        }
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Extract the name from the subdomain
        const name = hostname.split('.')[0];

        // Extract the provider
        const provider =
            hostname.includes('amazonaws') ? 'AWS' :
                hostname.includes('core.windows') ? 'Azure' :
                    hostname.includes('cloud-object-storage') ? 'IBM Cloud' :
                        hostname.includes('digitaloceanspaces') ? 'DigitalOcean' :
                            'Unknown';

        // Extract the region from query params or URL pattern
        const parts = hostname.split('.');
        const region = urlObj.searchParams.get('region') ||
            parts.find(part => part.match(/[a-z]{2,3}-[a-z]+-\d/)) ||
            'Unknown';

        return { name, provider, region, apiUrl: url };
    } catch (error) {
        console.error('Error parsing URL:', error);
        return {
            name: '',
            provider: '',
            region: 'Unknown',
            apiUrl: url
        };
    }
};

// ---------------- Add a new service to LocalStorage ----------------
export const addService = async (
    service: Omit<Service, 'id'>,
    userId: string,
    setServices: React.Dispatch<SetStateAction<Service[]>>,
    setIsSubmitting: React.Dispatch<SetStateAction<boolean>>
) => {
    if (!userId) return;
    setIsSubmitting(true);

    try {
        // Fetch existing services
        const storedServices = localStorage.getItem("services");
        const existingServices: Service[] = storedServices ? JSON.parse(storedServices) : [];

        // Check if API already exists
        if (existingServices.some(s => s.apiUrl === service.apiUrl)) {
            alert("This API URL already exists.");
            setIsSubmitting(false);
            return;
        }

        // Add new service
        const newService = { ...service, id: Date.now() }; // Mock ID
        const updatedServices = [...existingServices, newService];
        localStorage.setItem("services", JSON.stringify(updatedServices));

        alert("Service added successfully!");
        setServices(updatedServices);
    } catch (error) {
        console.error("Error adding service:", error);
    } finally {
        setIsSubmitting(false);
    }
};

// -------- Handle submit from Sidebar -----------
export const handleSubmit = async (
    inputValue: string,
    user: { id: string } | null,
    setIsSubmitting: React.Dispatch<SetStateAction<boolean>>
) => {
    if (!user) {
        alert("You need to be logged in to add a service");
        return;
    }
    const { name, provider, region, apiUrl } = parseApiUrl(inputValue);

    await addService(
        {
            name,
            provider,
            region,
            apiUrl,
            user_id: user.id
        },
        user.id,
        () => { },
        setIsSubmitting
    );
    alert("Service added successfully!");
};

// ---------------- Delete a Service from LocalStorage ----------------
export const deleteService = async (
    id: number,
    userId: string,
    setServices: SetState<Service[]>
) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    if (!userId) return;

    try {
        const storedServices = localStorage.getItem("services");
        const existingServices: Service[] = storedServices ? JSON.parse(storedServices) : [];

        // Remove the service
        const updatedServices = existingServices.filter(service => service.id !== id);
        localStorage.setItem("services", JSON.stringify(updatedServices));

        alert("Service deleted successfully!");
        setServices(updatedServices);
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};

// ---------------- Real-time Subscription (Replaced with useEffect) ----------------
export const useServiceSubscription = (userId: string, setServices: SetState<Service[]>) => {
    useEffect(() => {
        if (!userId) return;

        // Fetch data initially
        const fetchServices = async () => {
            const services = await fetchData(userId);
            setServices(services);
        };

        fetchServices();
    }, [userId]);
};

// ---------------- Date Formatting Helper ----------------
export const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};
