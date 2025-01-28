import { useState } from "react";
import { useUser } from "@clerk/nextjs";  // Import Clerk for user ID
import apiClient from "@/lib/apiClient";

const SubscriptionForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useUser();  // Get user ID from Clerk

    const handleSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            setMessage("You need to be logged in to subscribe.");
            setLoading(false);
            return;
        }

        const payload = {
            user_id: user.id, // Ensure user_id is sent
            email,
        };

        try {
            const response = await apiClient.post("/subscriptions/", payload);
            console.log("Response:", response.data);
            setMessage("Thank you for subscribing!");
        } catch (err) {
            console.error("Error subscribing:", err);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setEmail("");
        }
    };

    return (
        <form onSubmit={handleSubscription} className="space-y-4 mt-8">
            <label htmlFor="email" className="block text-sm font-medium">
                Subscribe to Our Newsletter
            </label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full px-3 py-2 border border-gray-400/[.25] rounded-md focus:ring focus:border-blue-500"
                required
            />
            <button
                type="submit"
                className={`w-full px-4 py-2 bg-blue-400 rounded hover:bg-blue-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
            {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
    );
};

export default SubscriptionForm;
