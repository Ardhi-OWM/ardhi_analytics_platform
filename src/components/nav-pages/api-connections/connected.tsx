"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Clerk authentication hook

import AddApi from './AddApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ButtonMine from "@/components/reusable/button-mine";
import apiClient from '@/lib/apiClient';

interface Service {
    id?: number;
    user_id: string;  // Clerk user ID remains
    name: string;
    provider: string;
    type: string;
    region: string;
    apiUrl: string;
    created_at?: string;
}

const ConnectedApiEndpoints = () => {
    const { user } = useUser(); 
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;
    
        const storedServices = localStorage.getItem("services");
        if (storedServices) {
            const parsedServices = JSON.parse(storedServices).map((service: unknown) => {
                if (typeof service === "object" && service !== null && "api_url" in service) {
                    return {
                        ...service,
                        apiUrl: (service as { api_url: string }).api_url, 
                    };
                }
                return service;
            });            
    
            console.log("Mapped Services:", parsedServices); 
            setServices(parsedServices);
        }
    }, [user]);
    

    // ---------- Add a New Service Linked to the User ----------
    const addService = async (newService: Service) => {
        if (!user || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const updatedServices = [...services, { ...newService, user_id: user.id }];
            setServices(updatedServices);
            localStorage.setItem("services", JSON.stringify(updatedServices));

            alert('Service added successfully!');
        } catch (error) {
            console.error("Error adding service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ------------- Delete Service from Local State -----------
    const deleteService = async (apiUrl: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        if (!user) return;
    
        try {
            const response = await apiClient.request({
                url: '/api-endpoints/delete_by_api_url/',
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                data: { api_url: apiUrl }
            });
    
            if (response.status === 204) {
                const updatedServices = services.filter((service) => service.apiUrl !== apiUrl);
                setServices(updatedServices);
                localStorage.setItem("services", JSON.stringify(updatedServices));
    
                alert("Service deleted successfully!");
            } else {
                alert("Failed to delete service from backend.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        }
    };
    

    // ------------- Date formatting  -----------
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="w-full flex flex-col ">
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

            {isModalOpen && (
                <AddApi
                    onClose={() => setIsModalOpen(false)}
                    onServiceAdded={(service) => addService({
                        ...service,
                        user_id: user?.id || '' // Ensure user ID is included
                    })}
                />
            )}

            {/* ----------------- Services Table -----------------*/}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Region</TableHead>
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
                            <TableCell>{service.region}</TableCell>
                            <TableCell className="text-sm text-blue-500 underline ibm-plex-mono-regular-italic">
                                <a href={service.apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {service.apiUrl}
                                </a>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(service.created_at)}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => deleteService(String(service.apiUrl))}
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

export default ConnectedApiEndpoints;
