"use client";

import React from "react";
import { X } from "lucide-react";
import CustomChatBox from "./CustomChatBox";

interface ArdhiChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArdhiChatPopup: React.FC<ArdhiChatPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-[270px] bottom-20 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 flex flex-col z-[1002] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Ardhi AI Assistant
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1">
        <CustomChatBox />
      </div>
    </div>
  );
};

export default ArdhiChatPopup;
