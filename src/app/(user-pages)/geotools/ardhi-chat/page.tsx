"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

const ArdhiChat: React.FC = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm Ardhi Chat. How can I assist you today with your geospatial questions ?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load OpenAI API key securely
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    // Function to fetch AI response with retry on 429 errors
    const fetchAIResponse = async (userMessage: string, retries: number = 3): Promise<void> => {
        setIsTyping(true);
    
        // Check if API key is missing
        if (!OPENAI_API_KEY) {
            console.error("❌ OpenAI API Key is missing. Please set it in .env.local");
            setMessages(prev => [...prev, { text: "⚠️ Error: OpenAI API Key is missing!", sender: "bot" }]);
            setIsTyping(false);
            return;
        }
    
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
    
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: userMessage }],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
    
            // Handle API errors
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("🔑 Invalid API Key. Please check your OpenAI API Key.");
                } else if (response.status === 404) {
                    throw new Error("🚨 API Endpoint Not Found. Check the OpenAI URL.");
                } else if (response.status === 429 && retries > 0) {
                    console.warn("Rate limited! Retrying in 5 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                    return fetchAIResponse(userMessage, retries - 1); // Retry request
                } else {
                    throw new Error(`❌ API request failed with status ${response.status}`);
                }
            }
    
            const data = await response.json();
    
            // Validate API response
            if (!data.choices || data.choices.length === 0) {
                throw new Error("Invalid API response: No choices found.");
            }
    
            const aiMessage = data.choices[0].message.content;
            setMessages(prev => [...prev, { text: aiMessage, sender: "bot" }]);
    
        } catch (error: unknown) {
            console.error("Error fetching AI response:", error);
        
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
            setMessages(prev => [...prev, { text: `❌ ${errorMessage}`, sender: "bot" }]);
        } finally {
            setIsTyping(false);
        }
    };
    

    // Function to send user input
    const handleSend = () => {
        if (input.trim() === "") return;

        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");

        fetchAIResponse(input);
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-6 flex flex-col h-[80vh]">
                <h1 className="text-2xl font-bold text-green-500 text-center mb-4">
                    Ardhi Chat - Your Geospatial Assistant
                </h1>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg max-w-xs ${
                                msg.sender === "user"
                                    ? "ml-auto bg-green-500 text-white"
                                    : "mr-auto bg-gray-200 text-gray-900"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="mr-auto bg-gray-200 text-gray-900 p-3 rounded-lg max-w-xs">
                            <span className="animate-pulse">Typing...</span>
                        </div>
                    )}

                    {/* Auto-scroll reference */}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex items-center space-x-2">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ask something about geospatial data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArdhiChat;
