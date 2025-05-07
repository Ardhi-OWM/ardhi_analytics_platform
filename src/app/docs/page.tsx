import React from "react";

const DocsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white mt-18">
    <div className="max-w-6xl w-full px-6 py-12 text-gray-800">
    <h1 className="text-4xl text-green-500 font-bold mb-6 text-center">Ardhi Analytics Documentation</h1>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Overview</h2>
        <p className="mb-4">
        Ardhi Analytics is a next-generation geospatial platform designed to empower users—researchers, developers, urban planners, environmental scientists, and data analysts—to visualize, convert, and manage spatial data with ease. Ardhi combines advanced GIS technologies with a modern, intuitive interface to simplify geospatial workflows in the cloud.
        </p>
        <p className="mb-4">
        Built with flexibility and scalability in mind, Ardhi provides powerful tools for real-time data analysis, AI-assisted feature editing, data format conversion, and seamless model integration. Whether you're uploading large spatial datasets, editing complex geospatial features, or collaborating with stakeholders across sectors, Ardhi enables data-driven decision-making through an accessible web platform.
        </p>
        <p className="mb-4">
        Ardhi supports a wide range of geospatial formats and integrates with popular mapping frameworks like Leaflet.js. It offers a secure environment for managing organizational datasets, facilitating remote access to spatial tools, and streamlining workflows for field teams and analysts alike. With its emphasis on openness and extensibility, Ardhi is ideal for smart city planning, environmental monitoring, infrastructure development, disaster response, and educational use cases.
        </p>


        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4">
            <li>🌐 <strong>Dashboard</strong> — Upload and visualize geospatial datasets on a dynamic OpenStreetMap with contextual layers.</li>
            <li>☁️ <strong>Models/Datasets Connector</strong> — Integrate external GIS models and large-scale datasets with streamlined import/export tools.</li>
            <li>🔄 <strong>Data Converter</strong> — Seamlessly convert between formats like GeoJSON, CSV, SHP, GeoTIFF, and more.</li>
            <li>🛠️ <strong>Geospatial Tools</strong> — Edit map features interactively, analyze layers, and use AI to summarize spatial insights.</li>
            <li>📥 <strong>Results Download</strong> — Export analytics outputs in multiple file types and share with teams.</li>
            <li>🔐 <strong>Access Management</strong> — Role-based access and secure login via Clerk.dev integration.</li>
        </ul>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Architecture</h2>
        <p className="mb-4">
            Ardhi uses a modern full-stack architecture designed for high performance and ease of development:
        </p>
        <ul className="list-disc list-inside mb-4">
            <li><strong>Frontend</strong>: Next.js (App Router), TypeScript, TailwindCSS, Leaflet.js for mapping</li>
            <li><strong>Backend</strong>: Django (REST framework), PostgreSQL/PostGIS for spatial queries</li>
            <li><strong>Auth</strong>: Clerk.dev for user authentication and session control</li>
            <li><strong>Deployment</strong>: Frontend on Netlify, Backend on Render</li>
            <li><strong>AI Services</strong>: Integrated with ChatGPT for spatial data assistance</li>
        </ul>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside mb-4">
        <li> Clone the repository from GitHub:&nbsp;
            <a
                href="https://github.com/Ardhi-OWM/ardhi_analytics_platform.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
            >
                https://github.com/Ardhi-OWM/ardhi_analytics_platform.git
            </a>
        </li>

            <li>Set up environment variables for the frontend and backend (see <code>.env.local</code>).</li>
            <li>Install dependencies: <span className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ml-1">npm install</span> (frontend), <span className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ml-1">pip install -r requirements.txt</span> (backend)</li>
            <li>Run the frontend: <span className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ml-1">npm run dev</span></li>

            <li>Run the backend server: <span className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ml-1">python3 manage.py runserver</span></li>
        </ol>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Usage</h2>
            <p className="mb-4">
            Once logged in, users land on the main dashboard—a central hub where geospatial workflows begin. From here, users can:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Upload spatial datasets</strong> such as GeoJSON, Shapefiles, CSVs, or raster files for quick visualization and inspection on an interactive OpenStreetMap view.</li>
            <li><strong>Convert data formats</strong> across supported geospatial and tabular types using the built-in converter, enabling interoperability across GIS platforms.</li>
            <li><strong>Edit geospatial features</strong> directly via map-based tools or use AI-powered assistants to summarize metadata, detect anomalies, or assist with schema standardization.</li>
            <li><strong>Generate and manage access codes</strong> for organizations—allowing project collaborators, trainees, or external analysts to access predefined datasets and courses securely and temporarily.</li>
            </ul>
            <p className="mb-4">
            All interactions are logged and can be traced for audit or reporting purposes. Whether you're managing assets in urban planning or modeling environmental impacts, Ardhi Analytics provides a unified, modern interface to simplify complex spatial workflows.
            </p>


        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Support & Community</h2>
        <p className="mb-4">
            Ardhi is part of the Prototype Fund and supported by the Open Knowledge Foundation and BMBF. Join our community on GitHub to contribute, file issues, and collaborate.
        </p>
        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Contact</h2>
        <p className="mb-2"> For support, contributions, or collaboration inquiries, feel free to reach out:</p>
        <ul className="list-none space-y-2">
        <li>
            <strong>Project Lead:</strong> <a href="ardhi.ochwuma@gmail.com" className="text-blue-600 underline">ardhi.ochwuma@gmail.com</a>
        </li>
        <li>
            <strong>GitHub:</strong> <a href="https://github.com/Ardhi-OWM/ardhi_analytics_platform.git" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://github.com/Ardhi-OWM/ardhi_analytics_platform.git</a>
        </li>
        <li>
            <strong>Website:</strong> <a href="https://ardhi.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://ardhi.de</a>
        </li>
        </ul>

    </div>
    </div>
  );
};

export default DocsPage;
