"use client";

import React, { useState, useRef, useEffect } from "react";
import { CaptionsOff, Send } from "lucide-react";
import { env } from "@/env";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const CustomChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Ardhi AI assistant. How can I help you with geospatial analysis today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAIResponse = async (userInput: string) => {
    const apiKey = env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.");
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant specialized in geospatial analysis, GIS, and mapping. Provide concise, technical, and accurate responses.",
              },
              {
                role: "user",
                content: userInput,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API response error:", errorData);
        throw new Error(
          errorData?.error?.message ||
            `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage as Message]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await fetchAIResponse(input);
      const botMessage: Message = {
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log(error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about geospatial analysis..."
            className="flex-1 p-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomChatBox;
