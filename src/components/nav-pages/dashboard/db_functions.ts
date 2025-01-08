// db_functions.ts
export const inputData = (url: string) => {
    console.log("Processing Data URL:", url);
    // Add logic to fetch data or process the URL
};

export const handleDataChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDataUrl: React.Dispatch<React.SetStateAction<string>>
) => {
    setDataUrl(event.target.value);
};
