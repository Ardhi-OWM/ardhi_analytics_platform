declare module 'shapefile' {
    import { GeoJsonObject } from 'geojson';
    export function read(file: File): Promise<GeoJsonObject>;
  }