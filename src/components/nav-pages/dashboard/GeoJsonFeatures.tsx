import { Overlay } from "pigeon-maps";

// Type for GeoJSON data (RFC 7946 Standard)
interface GeoJsonPoint {
    type: "Point";
    coordinates: [number, number];
}

interface GeoJsonPolygon {
    type: "Polygon";
    coordinates: [number[][]];  // Polygon: An array of arrays containing [lng, lat] pairs
}

interface GeoJsonMultiPolygon {
    type: "MultiPolygon";
    coordinates: [number[][][]];  // MultiPolygon: Multiple polygons with [lng, lat] pairs
}

interface GeoJsonFeature {
    type: "Feature";
    geometry: GeoJsonPoint | GeoJsonPolygon | GeoJsonMultiPolygon;
}

interface GeoJsonData {
    type: "FeatureCollection";
    features: GeoJsonFeature[];
}

/**
 * Renders GeoJSON features (Points, Polygons, MultiPolygons) on Pigeon Maps.
 * @param geoJsonData GeoJSON data to be visualized (FeatureCollection)
 * @returns An array of Overlay components to be displayed on the map
 */
export const renderGeoJsonFeatures = (geoJsonData: GeoJsonData | null) => {
    if (!geoJsonData) return null;

    return geoJsonData.features.map((feature, index) => {
        const { type, coordinates } = feature.geometry;

        // Point Handling
        if (type === "Point") {
            const [lng, lat] = coordinates;
            return (
                <Overlay key={index} anchor={[lat, lng]}>
                    <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white" />
                </Overlay>
            );
        }

        // Polygon Handling
        if (type === "Polygon") {
            return coordinates.map((polygon, i) =>
                polygon.map(([lng, lat], j) => (
                    <Overlay key={`${index}-${i}-${j}`} anchor={[lat, lng]}>
                        <div className="bg-blue-500 w-2 h-2 rounded-full border border-white" />
                    </Overlay>
                ))
            );
        }

        // MultiPolygon Handling
        if (type === "MultiPolygon") {
            return coordinates.map((multiPolygon, i) =>
                multiPolygon.map((polygon, j) =>
                    polygon.map(([lng, lat], k) => (
                        <Overlay key={`${index}-${i}-${j}-${k}`} anchor={[lat, lng]}>
                            <div className="bg-blue-500 w-2 h-2 rounded-full border border-white" />
                        </Overlay>
                    ))
                )
            );
        }

        // If geometry type is not supported
        return null;
    });
};
