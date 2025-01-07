"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@clerk/nextjs'; // Import Clerk hook

import AddApi from './AddApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ButtonMine from "@/components/reusable/button-mine";

interface Service {
    id?: number;
    user_id: string;  // Added Clerk user ID
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

const ConnectedApiEndpoints = () => {
    const { user } = useUser(); // Fetching Clerk authenticated user
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch Services for the Logged-in User Only
        const fetchData = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', user.id);  // Fetch only the services of the logged-in user

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setServices(data);
            }
        };

        fetchData();

        // Real-Time Sync Setup (No Auth)
        const subscription = supabase
            .channel('services_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]); // Only `user` is needed in the dependency array

    // ---------- Add a New Service Linked to the User ----------
    const addService = async (newService: Service) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('services')
                .insert([
                    {
                        ...newService,
                        user_id: user.id  // Attach user_id when adding
                    }
                ]);
            if (error) {
                console.error('Supabase Error:', error.message || error);
                throw new Error(error.message); // Throw error with message
            }

            alert('Service added successfully!');
            setServices((prevServices) => [...prevServices, newService]); // Update state directly
        } catch (error) {
            console.error('Error adding service:', error instanceof Error ? error.message : error);
        }
    };

    // ------------- Delete Service from Supabase (User-Specific) -----------
    const deleteService = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        if (!user) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .match({ id, user_id: user.id }); // Ensure only the user's service is deleted

            if (error) {
                console.error('Error deleting data:', error.message);
            } else {
                alert('Service deleted successfully!');
                setServices((prevServices) => prevServices.filter((service) => service.id !== id)); // Update state directly
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    // ------------- Date formatting  -----------
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div>
            <h1 className="text-2xl ubuntu-mono-bold mb-4">Connected API Endpoints</h1>

            {/* Button to Open Modal */}
            <div className="flex justify-center w-1/2 md:w-1/4 my-6">
                <ButtonMine
                    href={undefined}
                    className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight"
                    onClick={() => setIsModalOpen(true)}
                    white={false}
                    px={4}
                >
                    <span className="hover:text-green-600 hover:underline "> Add API Endpoint </span>
                </ButtonMine>
            </div>

            {/* --------- Show AddApi Modal When Opened-------- */}
            {isModalOpen && (
                <AddApi
                    onClose={() => setIsModalOpen(false)}
                    onServiceAdded={(service) => addService({ ...service, user_id: user?.id || '' })}
                />
            )}

            {/* ----------------- Services Table -----------------*/}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Provider</TableHead>
                        {/* <TableHead>Type</TableHead> */}
                        <TableHead>Region</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead>API URL</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service, index) => (
                        <TableRow key={service.id || index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>{service.provider}</TableCell>
                            {/* <TableCell>{service.type}</TableCell> */}
                            <TableCell>{service.region}</TableCell>
                            <TableCell className="text-sm text-blue-500 underline ibm-plex-mono-regular-italic">
                                <a href={service.apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {service.apiUrl}
                                </a>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(service.created_at)}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => deleteService(service.id!)}
                                    className="bg-red-400  px-4 py-1 rounded hover:bg-red-600 text-sm"
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

export default ConnectedApiEndpoints;