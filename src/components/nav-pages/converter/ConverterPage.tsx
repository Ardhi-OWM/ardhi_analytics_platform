"use client";
import { Divider } from "@nextui-org/divider";

// API Layout Component
export default function ConverterPage() {


    return (
        <div className='w-full '>
            {/* Header Section */}
            <div className="my-6 mx-8">
                <Divider className="my-4" />
                <h1 className="text-4xl text-gray-500 roboto-mono-bold">
                    Convert Data
                </h1>
                <Divider className="my-4" />
                <h3 className="text-xl text-gray-500 roboto-mono-bold">
                    Select a file to Convert to a different format
                </h3>
                <p>
                    We support many different file formats. Choose the format that best matches the way you will use the data.
                </p>
            </div>
        </div>
    );
}
