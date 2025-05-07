import React from "react";

const DocsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 mt-18">
        <h1 className="text-4xl text-green-500 font-bold mb-6">Ardhi Analytics Documentation</h1>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Overview</h2>
        <p className="mb-4">
            Ardhi Analytics is a next-generation geospatial platform designed to empower users—researchers, developers, urban planners, and data scientists—to visualize, convert, and manage spatial data with ease. Ardhi combines advanced GIS technologies with a modern, intuitive interface to simplify geospatial workflows in the cloud.
        </p>
        <p className="mb-4">
            Built with flexibility and scalability in mind, Ardhi provides powerful tools for real-time data analysis, AI-assisted editing, format conversion, and seamless model integration. Whether you're uploading datasets, editing geospatial features, or collaborating on spatial intelligence, Ardhi enables data-driven decision making across sectors.
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
            Once logged in, users can navigate to the dashboard to upload spatial datasets, view results over interactive maps, convert files to supported formats, and interact with AI-based tools to summarize or edit data. Organizations can also generate secure access codes for trainees or partners to access specific course content and datasets.
        </p>

        <h2 className="text-2xl text-green-500 font-semibold mt-8 mb-4">Support & Community</h2>
        <p className="mb-4">
            Ardhi is part of the Prototype Fund and supported by the Open Knowledge Foundation and BMBF. Join our community on GitHub to contribute, file issues, and collaborate.
        </p>
    </div>
  );
};

export default DocsPage;
