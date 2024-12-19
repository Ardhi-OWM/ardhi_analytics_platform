// components/Shared/Header
"use client";

const Footer: React.FC = () => {
    return (
        <footer className="text-center py-4 fixed bottom-0 w-full tagline text-xs text-gray-500">
            <p>&copy;
                {new Date().getFullYear()} Ardhi. All rights reserved.</p>
        </footer>
    );
};
export default Footer;