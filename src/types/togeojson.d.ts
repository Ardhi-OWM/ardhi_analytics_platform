declare module '@mapbox/togeojson' {
    import { GeoJsonObject } from 'geojson';
  
    export function kml(doc: Document): GeoJsonObject;
    export function gpx(doc: Document): GeoJsonObject;
  }
  