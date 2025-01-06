export default function OverviewApiEndpoints() {
    return (
        <div className="mt-2 mx-8">
            {/* <p className="text-gray-400">Add new connections here!</p> */}
            <h1 className="text-2xl text-gray-500 roboto-mono-bold my-2">
                Overview
            </h1>
            <p>
                When a user enters an API URL (e.g.,
                <span className="text-sm bg-gray-200/[0.25] source-code-pro-semibold">
                    https://dynamodb.us-west-2.amazonaws.com
                </span> ), the application extracts the following details:
            </p>
            <ul className="list-disc ml-8 mt-4">
                <li><span className="font-bold ">Name:</span>  The name of the service being provided. </li>
                <li><span className="font-bold ">Provider: </span> The cloud provider (e.g., AWS, Azure, IBM Cloud, DigitalOcean). </li>
                <li><span className="font-bold ">Region </span> The region where the API is hosted (e.g., us-west-2). </li>
                <li><span className="font-bold ">API URL</span> The full URL provided.</li>
            </ul>

            <h1 className="text-lg text-gray-500 my-2 underline">
            Input Validation
            </h1>
            <ul className="list-disc ml-8 mt-4">
                <li>  
                    Make sure your URL starts with 
                    <span className="text-sm bg-gray-200/[0.25] source-code-pro-semibold"> http:// </span>
                     or 
                     <span className="text-sm bg-gray-200/[0.25] source-code-pro-semibold"> https:// </span>
                     . If not, it throws an error. </li>
            </ul>
        </div>
    );
}
