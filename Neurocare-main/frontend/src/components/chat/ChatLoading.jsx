// src/components/chat/ChatLoading.jsx
import React from "react";

const ChatLoading = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-[45px] w-full rounded-md bg-gray-200 animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default ChatLoading;
