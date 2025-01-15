'use client';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from 'lucide-react';

import { mapLayers } from '@/components/constants';

export default function DropDowns() {

    const [isOpen, setIsOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(
        mapLayers.find(layer => layer.default)?.url || mapLayers[0].url
    );

    return (
        <div>
            <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                <DropdownMenuTrigger asChild>
                    <span className="flex items-center px-4 py-2 border border-purple-300 rounded-md cursor-pointer shadow-lg bg-background">
                        {mapLayers.find((layer) => layer.url === activeLayer)?.name || "Select Map Layer"}
                        <span className="ml-2">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    align="start"
                    className="border border-gray-300 rounded-lg shadow-md"
                >
                    {mapLayers.map((layer) => (
                        <DropdownMenuItem
                            key={layer.url}
                            onClick={() => setActiveLayer(layer.url)}
                            className={`cursor-pointer ${activeLayer === layer.url ? "bg-blue-500 " : "hover:bg-gray-200"
                                }`}
                        >
                            {layer.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
};
