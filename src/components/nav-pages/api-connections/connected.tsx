"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

import AddApi from './AddApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ButtonMine from "@/components/reusable/button-mine";


interface Service {
    id?: number;
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

const ConnectedApiEndpoints = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    //  Fetch Data from Supabase
    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('services').select('*');
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setServices(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();

        // Real-Time Sync Setup (No Auth)
        const subscription = supabase
            .channel('services_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    //  Delete Service from Supabase
    const deleteService = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const { error } = await supabase.from('services').delete().match({ id });
            if (error) {
                console.error('Error deleting data:', error.message);
            } else {
                alert('Service deleted successfully!');
                fetchData();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return (
        <div>
            <h1 className="text-2xl ubuntu-mono-bold mb-4">Connected API Endpoints</h1>

            {/* Button to Open Modal */}
            <div className="flex justify-center w-1/2 md:w-1/4 my-6">
                <ButtonMine
                    href={undefined}
                    className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        setIsModalOpen(true); // Show Add API Endpoint popup
                    }}
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
                    onServiceAdded={(service) => setServices((prev) => [...prev, service])}
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
