import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ButtonMine from "@/components/reusable/button-mine";

export default function ConnectedApiEndpoints() {
    const [showAddEndpoint, setShowAddEndpoint] = useState(false); // State for toggling popup
    const [endpoints, setEndpoints] = useState<Array<{
        name: string;
        provider: string;
        type: string;
        region: string;
        status: string;
    }>>([]);

    const handleAddEndpoint = (newEndpoint: {
        name: string;
        provider: string;
        type: string;
        region: string;
        status: string;
    }) => {
        setEndpoints((prev) => [...prev, newEndpoint]); // Add new endpoint to the list
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {endpoints.length > 0 ? (
                        endpoints.map((endpoint, index) => (
                            <TableRow key={`${endpoint.name}-${index}`}>
                                <TableCell>{endpoint.name}</TableCell>
                                <TableCell>{endpoint.provider}</TableCell>
                                <TableCell>{endpoint.type}</TableCell>
                                <TableCell>{endpoint.region}</TableCell>
                                <TableCell>{endpoint.status}</TableCell>
                                <TableCell>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        onClick={() =>
                                            setEndpoints((prev) =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No endpoints added.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Add API Endpoint Section */}
            <div className="flex justify-center w-1/2 md:w-1/4 mt-6">
                <ButtonMine
                    href={undefined}
                    className="w-full mx-auto px-4 text-xs sm:text-sm leading-tight"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault(); // Prevent link navigation
                        setShowAddEndpoint(true); // Show Add API Endpoint popup
                    }}
                    white={false}
                    px={4}
                >
                    <span className="hover:text-green-600 hover:underline"> Add API Endpoint </span>
                </ButtonMine>
            </div>

            {/* Conditional Rendering of Add API Endpoint Popup */}
            {showAddEndpoint && (
                <ApiEndpointPopup
                    onClose={() => setShowAddEndpoint(false)} // Close popup
                    onSave={handleAddEndpoint} // Pass handler to save endpoint
                />
            )}
        </>
    );
}

export function ApiEndpointPopup({
    onClose,
    onSave,
}: {
    readonly onClose: () => void;
    readonly onSave: (endpoint: { name: string; provider: string; type: string; region: string; status: string }) => void;
}) {
    const [endpoint, setEndpoint] = useState("");

    const extractProvider = (url: string): string => {
        try {
            const { hostname } = new URL(url);
            const domainParts = hostname.split(".");
            return domainParts.length > 2
                ? domainParts[1] // Extract second-level domain (e.g., "github" from "api.github.com")
                : domainParts[0]; // For domains like "example.com"
        } catch (error) {
            if (error instanceof Error) {
                console.error("Invalid URL:", error.message);
            } else {
                console.error("Invalid URL:", error);
            }
            return "Unknown Provider";
        }
    };

    const handleSave = () => {
        if (endpoint.trim()) {
            const provider = extractProvider(endpoint);
            const name = endpoint.split("/").pop() || "Unnamed Endpoint";
            onSave({
                name,
                provider: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider
                type: "Production", // Default type
                region: "-", // Placeholder for region
                status: "Active", // Default status
            });
            onClose();
        } else {
            alert("Please enter a valid API endpoint.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 w-1/2">
                <h2 className="text-xl mb-4 roboto-mono-semibold">Add API Endpoint</h2>
                <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full border ibm-plex-mono-regular-italic border-gray-300 rounded p-2 mb-4"
                    placeholder="Enter API Endpoint"
                />
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
