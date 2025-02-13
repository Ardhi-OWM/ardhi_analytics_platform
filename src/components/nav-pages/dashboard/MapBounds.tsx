import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { GeoJsonObject } from "geojson";
import { kml as kmlToGeoJSON } from "@tmcw/togeojson";

const MapBounds: React.FC<{ geoJSONDataList?: GeoJsonObject[]; kmlFileUrl?: string }> = ({
    geoJSONDataList = [],
    kmlFileUrl,
}) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const  allBounds: L.LatLngBounds[] = [];

        //  Handle GeoJSON Bounds (DO NOT ADD LAYERS)
        if (geoJSONDataList.length > 0) {
            geoJSONDataList.forEach((geoJSON) => {
                const layer = L.geoJSON(geoJSON as GeoJsonObject);
                const bounds = layer.getBounds();
                if (bounds.isValid()) allBounds.push(bounds);
            });
        }

        //  Handle KML (Convert to GeoJSON but DO NOT ADD LAYER)
        if (kmlFileUrl) {
            console.log("Fetching KML File:", kmlFileUrl);
            
            fetch(kmlFileUrl)
                .then((res) => res.text())
                .then((kmlText) => {
                    const parser = new DOMParser();
                    const kml = parser.parseFromString(kmlText, "application/xml");
                    const geoJSONData = kmlToGeoJSON(kml); //  Convert KML to GeoJSON

                    if (geoJSONData) {
                        const layer = L.geoJSON(geoJSONData);
                        const bounds = layer.getBounds();
                        if (bounds.isValid()) allBounds.push(bounds);
                    }
                })
                .catch((err) => console.error("Error loading KML file:", err));
        }

        //  Fit Bounds to ALL Features
        if (allBounds.length > 0) {
            const mergedBounds = allBounds.reduce((acc, bounds) => acc.extend(bounds), allBounds[0]);
            if (mergedBounds.isValid()) {
                map.fitBounds(mergedBounds);
            }
        }
    }, [geoJSONDataList, kmlFileUrl, map]);

    return null;
};

export default MapBounds;
