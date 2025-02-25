export default function OverviewModelDatasets() {
    return (
        <div className="mt-2 mx-8">
            <h1 className="text-2xl text-gray-500 roboto-mono-bold my-2">
                Overview
            </h1>
            <p>
                When a user adds a model or dataset (e.g., a machine learning model or geospatial dataset), the application extracts the following details:
            </p>
            <ul className="list-disc ml-8 mt-4">
                <li><span className="font-bold">Name:</span> The name of the model or dataset.</li>
                <li><span className="font-bold">Type:</span> Specifies whether it is a model or a dataset.</li>
                <li><span className="font-bold">Provider:</span> The cloud or on-premises provider (e.g., AWS, Google Cloud, DigitalOcean).</li>
                <li><span className="font-bold">Region:</span> The region where the model/dataset is stored or hosted.</li>
                <li><span className="font-bold">Storage Location:</span> The location or URL where the model or dataset is stored.</li>
            </ul>

            <h1 className="text-lg text-gray-500 my-2 underline">
                Input Validation
            </h1>
            <ul className="list-disc ml-8 mt-4">
                <li>
                    Ensure the storage location is a valid URL or file path.
                </li>
                <li>
                    If providing a cloud-based storage location, confirm that the correct access permissions are set.
                </li>
            </ul>
        </div>
    );
}
