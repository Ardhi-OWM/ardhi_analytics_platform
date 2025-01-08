// db_functions.ts
import { Map as PigeonMap } from "pigeon-maps";
/**
 * Fetches and reads GeoJSON data from a provided URL.
 * @param url - The URL of the GeoJSON file.
 * @returns The parsed GeoJSON data if successful.
 */
export const inputData = async (url: string) => {
    try {
        let processedUrl = url;

        // Convert GitHub links to raw file links for direct access
        if (processedUrl.includes("github.com")) {
            processedUrl = processedUrl
                .replace("github.com", "raw.githubusercontent.com")
                .replace("/blob/", "/");
        }

        console.log("Fetching Data from:", processedUrl);

        // Fetching the GeoJSON file
        const response = await fetch(processedUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        // Parsing the fetched GeoJSON data
        const geoJsonData = await response.json();
        console.log("Data Fetched Successfully:", geoJsonData);

        // Return the GeoJSON data for further processing
        return geoJsonData;
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please check the link.");
    }
};


/**
 * Handles submission of GeoJSON data for Pigeon Maps.
 * @param dataUrl URL for the GeoJSON data
 * @param mapRef Pigeon Map instance reference
 * @param setGeoJsonData Callback to store GeoJSON data in state
 */
export const handleSubmitData = async (
    dataUrl: string,
    mapRef: React.RefObject<PigeonMap | null>,
    setGeoJsonData: React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection>>
) => {
    try {
        if (!mapRef.current) {
            throw new Error("Map instance not available");
        }

        if (!dataUrl.startsWith('http://') && !dataUrl.startsWith('https://')) {
            throw new Error("Invalid URL. Please use a valid link with 'http://' or 'https://'");
        }

        let processedUrl = dataUrl;
        if (processedUrl.includes("github.com")) {
            processedUrl = processedUrl
                .replace("github.com", "raw.githubusercontent.com")
                .replace("/blob/", "/");
        }

        const response = await fetch(processedUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const geoJsonData = await response.json();
        console.log("GeoJSON Data Fetched Successfully:", geoJsonData);

        // ✅ Store GeoJSON data for rendering in the map
        setGeoJsonData(geoJsonData);
        alert("GeoJSON data visualized on the map!");

    } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof Error) {
            alert(`Error: ${error.message}`);
        } else {
            alert("An unknown error occurred.");
        }
    }
};



// db_functions.ts
/**
 * Handles input changes for updating the data URL state.
 * @param event - The event object from the input field.
 * @param setDataUrl - The state setter function for updating the dataUrl state.
 */
export const handleDataChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDataUrl: React.Dispatch<React.SetStateAction<string>>
) => {
    setDataUrl(event.target.value);
};
