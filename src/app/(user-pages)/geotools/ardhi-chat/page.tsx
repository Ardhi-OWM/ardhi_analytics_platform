"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Plus, MessageSquare, Paperclip } from "lucide-react";

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// Add these imports at the top
import { GeoJsonObject, FeatureCollection } from "geojson";
import * as GeoTIFF from "geotiff";
import * as toGeoJSON from "@tmcw/togeojson";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ArdhiChat: React.FC = () => {
  // Add new state for file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  // Initialize messages with useEffect to avoid hydration mismatch
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Add initialization effect
  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm Ardhi Chat. How can I assist you today with your geospatial questions?",
        sender: "bot",
      },
    ]);
  }, []);

  // Create new chat with stable ID
  // Remove duplicate declaration and use only the useCallback version
  const createNewChat = useCallback(() => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([
      {
        text: "Hello! I'm Ardhi Chat. How can I assist you today with your geospatial questions?",
        sender: "bot",
      },
    ]);
  }, []);

  // Add this at the top level of the component
  useEffect(() => {
    // Create initial chat if none exists
    if (chatHistory.length === 0) {
      createNewChat();
    }
  }, [createNewChat]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // Function to fetch AI response with retry on 429 errors
  const fetchAIResponse = async (
    userMessage: string,
    retries: number = 3
  ): Promise<void> => {
    setIsTyping(true);

    // Check if API key is missing
    if (!OPENAI_API_KEY) {
      console.error(
        "❌ OpenAI API Key is missing. Please set it in .env.local"
      );
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error: OpenAI API Key is missing!", sender: "bot" },
      ]);
      setIsTyping(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 200,
            temperature: 0.7,
          }),
        }
      );

      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "🔑 Invalid API Key. Please check your OpenAI API Key."
          );
        } else if (response.status === 404) {
          throw new Error("🚨 API Endpoint Not Found. Check the OpenAI URL.");
        } else if (response.status === 429 && retries > 0) {
          console.warn("Rate limited! Retrying in 5 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
          return fetchAIResponse(userMessage, retries - 1); // Retry request
        } else {
          throw new Error(
            `❌ API request failed with status ${response.status}`
          );
        }
      }

      const data = await response.json();

      // Validate API response
      if (!data.choices || data.choices.length === 0) {
        throw new Error("Invalid API response: No choices found.");
      }

      const aiMessage = data.choices[0].message.content;
      setMessages((prev) => [...prev, { text: aiMessage, sender: "bot" }]);
    } catch (error: unknown) {
      console.error("Error fetching AI response:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setMessages((prev) => [
        ...prev,
        { text: `❌ ${errorMessage}`, sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to send user input
  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, newMessage]);

    // Update chat history
    if (currentChatId) {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
    }

    setInput("");
    fetchAIResponse(input);
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add new state for file handling
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; type: string }[]
  >([]);

  // Add this function to handle file uploads
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    setSelectedFile(file);

    try {
      let fileContent = "";
      let messageText = `Uploaded file: ${file.name}\n`;

      if (fileExtension === "geojson") {
        fileContent = await file.text();
        const geoJSON = JSON.parse(fileContent) as FeatureCollection;
        messageText += `GeoJSON with ${geoJSON.features.length} features`;
      } else if (fileExtension === "kml") {
        fileContent = await file.text();
        const parser = new DOMParser();
        const kml = parser.parseFromString(fileContent, "text/xml");
        const geoJSON = toGeoJSON.kml(kml) as FeatureCollection;
        messageText += `KML converted to GeoJSON with ${geoJSON.features.length} features`;
      } else if (fileExtension === "csv") {
        fileContent = await file.text();
        messageText += "CSV file uploaded";
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        messageText += `Excel file uploaded with ${workbook.SheetNames.length} sheets`;
      } else if (fileExtension === "tif" || fileExtension === "tiff") {
        messageText += "GeoTIFF file uploaded";
      } else {
        messageText = "❌ Unsupported file format";
      }

      // Add file to message history
      setMessages((prev) => [...prev, { text: messageText, sender: "user" }]);

      // Store file info
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, type: fileExtension || "unknown" },
      ]);

      // Trigger AI response about the uploaded file
      fetchAIResponse(
        `I've uploaded a ${fileExtension?.toUpperCase()} file named ${
          file.name
        }. Can you help me analyze it?`
      );
    } catch (error) {
      console.error("Error processing file:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `❌ Error processing file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          sender: "bot",
        },
      ]);
    }
  };

  const renderChatContent = () => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Welcome to Ardhi Chat
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
            Your intelligent geospatial assistant. Upload files or ask questions
            about GIS, mapping, and spatial analysis.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300"
            >
              <Paperclip size={20} />
              Upload File
            </button>
            <button
              onClick={() => {
                setInput("Tell me about geospatial analysis");
                handleSend();
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-50 transition-all duration-300"
            >
              <MessageSquare size={20} />
              Start Chat
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-2xl max-w-md break-words ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              } shadow-md`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <div className="w-full h-[88dvh] mt-18 flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white h-full flex flex-col" suppressHydrationWarning>
        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="flex items-center space-x-2 w-full p-4 hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`flex items-center space-x-2 w-full p-4 hover:bg-gray-800 transition-colors duration-200 ${
                currentChatId === chat.id ? "bg-gray-800" : ""
              }`}
            >
              <MessageSquare size={16} />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 p-4 border-b bg-white">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Ardhi Chat - Your Geospatial Assistant
          </h1>
        </div>

        {/* Dynamic Chat Content */}
        {renderChatContent()}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="relative">
            {selectedFile && (
              <div className="absolute -top-12 left-0 bg-gray-100 p-2 rounded-lg flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-4 pr-16 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors duration-300"
                placeholder="Ask something about geospatial data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".geojson,.json,.kml,.gpx,.csv,.xlsx,.xls,.tif,.tiff"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-green-500 transition-colors duration-300"
                title="Attach geospatial file"
              >
                <Paperclip size={20} />
              </button>
              <button
                onClick={handleSend}
                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim() && !selectedFile}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArdhiChat;
