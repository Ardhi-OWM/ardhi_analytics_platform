// @Components/constants/index.js

// ------------------- Navigation Links ------------------- //
export const headerLinks = [
    {
        id: "0",
        name: "Dashboard",
        href: "/dashboard",
        current: false // This is the current page
    },
    {
        id: "1",
        name: "API Connections",
        href: "/api-connections",
        current: false
    },
    {
        id: "3",
        name: "Converter",
        href: "/converter",
        current: false
    },
];
// ------------------- FileFormats Links ------------------- //

export const fileFormats = [
    { value: "geojson", label: "GeoJSON" },
    { value: "csv", label: "CSV" },
    { value: "html", label: "HTML(Leaflet)" },
    { value: "shp", label: "Shapefile" },
    { value: "kml", label: "KML" }
];

// ------------------- Dashboard Links ------------------- //
export const helpLinks = [
    {
        href: "https://ardhi.de/",
        label: "Help Page",
    },
    {
        href: "https://ardhi.de/",
        label: "Support",
    },
    {
        href: "https://ardhi.de/",
        label: "Feedback",
    },
];


// GIS cloud services
export const initialCloudServices = [
    {
        id: 1,
        name: 'amazon-production',
        provider: 'AWS',
        type: 'cloud -production',
        url: ' ',
        region: 'us-east-1',
        account: ' ',
    },
];
// ------------------- Map Layers Links ------------------- //
const MAPTILER_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN;


export const mapLayers = [
    {
        name: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        default: true,
    },
    {
        name: "Google Maps Satellite",
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    },
    {
        name: "Satellite Maptiler - v2",
        url: `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Carto Light",
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    },
    {
        name: "Esri World Imagery",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
    },
    /* {
        name: "Stamen Watercolor",
        url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    }, */
    {
        name: "Aquarelle",
        url: `https://api.maptiler.com/maps/aquarelle/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "DataViz",
        url: `https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Backdrop",
        url: `https://api.maptiler.com/maps/backdrop/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Landscape",
        url: `https://api.maptiler.com/maps/landscape/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Outdoor -V2",
        url: `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Toner -V2",
        url: `https://api.maptiler.com/maps/toner-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    },
    {
        name: "Winter -V2",
        url: `https://api.maptiler.com/maps/winter-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`,
    }

];