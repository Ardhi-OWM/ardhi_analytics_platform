"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, FeatureGroup, useMap, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import { mapLayers } from "@/components/constants";


const SearchControl = dynamic(
    () => import("@/components/nav-pages/dashboard/SearchControl"),
    { ssr: false }
);

interface Feature {
    id: number;
    type: string;
    latlngs: L.LatLng[] | L.LatLng | L.LatLng[][];
    name: string;
    comment?: string;
}

interface CreatedEvent {
    layerType: string;
    layer: L.Layer & {
        getLatLngs?: () => L.LatLng[] | L.LatLng[][];
        getLatLng?: () => L.LatLng;
        toGeoJSON: () => GeoJSON.Feature<GeoJSON.Geometry>;
    };
}

const MapUpdater = ({ activeLayer }: { activeLayer: string }) => {
    const map = useMap();
    useEffect(() => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        L.tileLayer(activeLayer).addTo(map);
        map.setView(center, zoom);
    }, [activeLayer, map]);
    return null;
};

const DigitizeMap = () => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const featureGroupRef = useRef<L.FeatureGroup | null>(null);
    const [activeLayer, setActiveLayer] = useState(mapLayers.find(layer => layer.default)?.url || mapLayers[0].url);

    const onCreated = (e: CreatedEvent) => {
        const { layerType, layer } = e;

        let newFeature: Feature | null = null;

        if (layerType === "polygon" || layerType === "rectangle") {
            newFeature = {
                id: new Date().getTime(),
                type: layerType,
                latlngs: layer.getLatLngs!(),
                name: "Unnamed Feature",
                comment: "",
            };
        } else if (layerType === "marker") {
            newFeature = {
                id: new Date().getTime(),
                type: layerType,
                latlngs: layer.getLatLng!(),
                name: "Unnamed Feature",
                comment: "",
            };
        } else if (layerType === "polyline") {
            newFeature = {
                id: new Date().getTime(),
                type: "polyline",
                latlngs: layer.getLatLngs!(),
                name: "Unnamed Line",
                comment: "",
            };
        }

        if (newFeature) {
            setFeatures([...features, newFeature]);
        }
    };


    const deleteFeature = (id: number) => {
        setFeatures(features.filter(feature => feature.id !== id));
    };

    const saveFeaturesAsGeoJSON = () => {
        const geoJSON = {
            type: "FeatureCollection",
            features: features.map(feature => ({
                type: "Feature",
                properties: { 
                    name: feature.name, 
                    type: feature.type,
                    comment: feature.comment || ""  
                },
                geometry: {
                    type: feature.type === "marker"
                        ? "Point"
                        : feature.type === "polyline"
                            ? "LineString"
                            : "Polygon",
                    coordinates:
                        feature.type === "marker"
                            ? [(feature.latlngs as L.LatLng).lng, (feature.latlngs as L.LatLng).lat]
                            : feature.type === "polyline"
                                ? (feature.latlngs as L.LatLng[]).map(latlng => [latlng.lng, latlng.lat])
                                : [(feature.latlngs as L.LatLng[][])[0].map(latlng => [latlng.lng, latlng.lat])],
                },
            })),
        };
    
        const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: "application/json" });
        saveAs(blob, "digitized_features.geojson");
    };
    


    return (
        <div className="flex flex-row h-screen relative ">
            <div className="w-3/12 p-4 bg-white dark:bg-[hsl(279,100%,3.9%)] border-r shadow-md overflow-y-auto">
                <h3 className="text-lg font-bold">Digitized Features</h3>
                {features.length > 0 ? (
                <ul>
                    {features.map((feature) => (
                        <li key={feature.id} className="flex flex-col space-y-2 border-b pb-2">
                            <input
                                type="text"
                                className="border p-1 text-xs"
                                value={feature.name}
                                onChange={(e) =>
                                    setFeatures(features.map(f =>
                                        f.id === feature.id ? { ...f, name: e.target.value } : f
                                    ))
                                }
                            />
                            <textarea
                                className="border p-1 text-xs"
                                placeholder="Add a comment (optional)"
                                value={feature.comment}
                                onChange={(e) =>
                                    setFeatures(features.map(f =>
                                        f.id === feature.id ? { ...f, comment: e.target.value } : f
                                    ))
                                }
                            />
                            <span className="text-sm text-gray-600">({feature.type})</span>
                            <button onClick={() => deleteFeature(feature.id)} className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No features added.</p>
            )}

                        
                <button onClick={saveFeaturesAsGeoJSON} className="mt-2 mb-8 px-4 py-2 bg-green-600 text-white rounded text-sm">
                    Download as GeoJSON
                </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
                <MapContainer
                    center={[52.520008, 13.404954]}
                    zoom={13}
                    className="h-screen w-full"
                >
                    <TileLayer url={activeLayer} />
                    <MapUpdater activeLayer={activeLayer} />
                    <SearchControl />
                    <FeatureGroup ref={featureGroupRef}>
                        <EditControl
                            position="topleft"
                            onCreated={onCreated}
                            draw={{
                                rectangle: true,
                                polygon: true,
                                circle: false,
                                circlemarker: false,
                                marker: true,
                                polyline: true,
                            }}
                        />
                    </FeatureGroup>
                    <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-[hsl(279,100%,3.9%)] p-2 shadow-md rounded">
                        <label className="mr-2 font-bold text-sm">Select Map:</label>
                        <select
                            value={activeLayer}
                            onChange={(e) => setActiveLayer(e.target.value)}
                            className="border p-1 rounded text-sm"
                        >
                            {mapLayers.map((layer) => (
                                <option key={layer.url} value={layer.url}>{layer.name}</option>
                            ))}
                        </select>
                    </div>
                </MapContainer>
            </div>
        </div>
    );
};

export default DigitizeMap;
