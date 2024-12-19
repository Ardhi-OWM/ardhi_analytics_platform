import MapComponent from "@/components/nav-pages/dashboard/Dashboard";
import React from "react";


const Dashboard: React.FC = () => {
    return (
        <div className="mt-18 relative">
            <div className="h-full overflow-hidden">
                <MapComponent />
            </div>
        </div>
    );
};

export default Dashboard;
