import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const SubscriptionForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("subscriptions")
                .insert([{ email }]);

            if (error) {
                if (error.code === "23505") {
                    setMessage("You are already subscribed!");
                } else {
                    throw error;
                }
            } else {
                setMessage("Thank you for subscribing!");
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setEmail("");
        }
    };

    useEffect(() => {
        // Set up real-time listener using Supabase channel
        const channel = supabase
            .channel("subscriptions_changes") // Create a named channel
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "subscriptions" },
                (payload) => {
                    console.log("New subscription added:", payload.new);
                    setMessage("A new subscription was just added!");
                }
            )
            .subscribe();

        // Cleanup the subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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
