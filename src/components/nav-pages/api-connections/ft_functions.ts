"use client";
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { SetStateAction } from 'react';

interface Service {
    id?: number;
    user_id: string;
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

// Typing the state setters correctly
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// ---------------- Fetch Services ----------------
export const fetchData = async (userId: string): Promise<Service[]> => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching data:', error);
        return [];
    }
    return data;
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
// ---------------- Add a new service to the database ----------------
export const addService = async (
    service: Omit<Service, 'id'>,
    userId: string,
    setServices: React.Dispatch<SetStateAction<Service[]>>,
    setIsSubmitting: React.Dispatch<SetStateAction<boolean>>
) => {
    if (!userId) return;
    setIsSubmitting(true);

    try {
        const { data, error } = await supabase
            .from('services')
            .insert([{
                ...service,
                user_id: userId
            }])
            .select('*');

        if (error) throw new Error(error.message);

        if (data) {
            alert('Service added successfully!');
            setServices((prev) => [...prev, ...data]);
        }
    } catch (error) {
        console.error('Error adding service:', error);
    } finally {
        setIsSubmitting(false);
    }
};
// -------- Handle submit from Sidebar -----------
export const handleSubmit = async (
    inputValue: string,
    inputType: "api" | "ml-model" | "dataset",
    user: any,
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
            type: inputType,
            region,
            apiUrl,
            user_id: user.id  // Added user_id to the object
        },
        user.id,
        () => { },
        setIsSubmitting
    );
    alert("Service added successfully!");
};

// ---------------- Delete a Service ----------------
export const deleteService = async (
    id: number,
    userId: string,
    setServices: SetState<Service[]>
) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    if (!userId) return;

    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .match({ id, user_id: userId });

        if (error) {
            console.error('Error deleting data:', error.message);
        } else {
            alert('Service deleted successfully!');
            setServices((prevServices) => prevServices.filter((service) => service.id !== id));
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
};

// ---------------- Real-time Subscription ----------------
export const useServiceSubscription = (userId: string, setServices: SetState<Service[]>) => {
    useEffect(() => {
        if (!userId) return;

        const subscription = supabase
            .channel('services_updates')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'services'
            }, (payload) => {
                setServices((prev) => {
                    const ids = new Set(prev.map(service => service.id));
                    if (!ids.has(payload.new.id)) {
                        return [...prev, payload.new as Service];
                    }
                    return prev;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userId]);
};

// ---------------- Date Formatting Helper ----------------
export const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};
