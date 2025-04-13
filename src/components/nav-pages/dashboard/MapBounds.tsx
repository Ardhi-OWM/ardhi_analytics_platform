import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { GeoJsonObject } from "geojson";
import { kml as convertKMLToGeoJSON } from "@tmcw/togeojson";

interface MapBoundsProps {
  geoJSONDataList?: GeoJsonObject[];
  kmlFileUrl?: string;
}

const MapBounds: React.FC<MapBoundsProps> = ({ geoJSONDataList = [], kmlFileUrl }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const boundsList: L.LatLngBounds[] = [];

    geoJSONDataList.forEach((geoJSON) => {
      const layer = L.geoJSON(geoJSON);
      const bounds = layer.getBounds();
      if (bounds.isValid()) boundsList.push(bounds);
    });

    const loadKML = async () => {
      try {
        const response = await fetch(kmlFileUrl!);
        const kmlText = await response.text();
        const kmlDoc = new DOMParser().parseFromString(kmlText, "application/xml");
        const geoJSON = convertKMLToGeoJSON(kmlDoc);

        const layer = L.geoJSON(geoJSON);
        const bounds = layer.getBounds();
        if (bounds.isValid()) boundsList.push(bounds);

        fitToBounds();
      } catch (error) {
        console.error("Error loading KML file:", error);
      }
    };

    const fitToBounds = () => {
      if (boundsList.length > 0) {
        const combinedBounds = boundsList.reduce((acc, b) => acc.extend(b), boundsList[0]);
        if (combinedBounds.isValid()) map.fitBounds(combinedBounds);
      }
    };

    if (kmlFileUrl) {
      loadKML();
    } else {
      fitToBounds();
    }

  }, [geoJSONDataList, kmlFileUrl, map]);

  return null;
};

export default MapBounds;
