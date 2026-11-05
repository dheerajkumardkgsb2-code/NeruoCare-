import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SingleChat from "./SingleChat";
import { ChatState } from "./Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <AnimatePresence mode="wait">
      {selectedChat ? (
        <motion.div
          key="chat-open"
          className="flex flex-col items-center p-3 bg-white w-full h-full rounded-2xl shadow-lg border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </motion.div>
      ) : (
        <motion.div
          key="chat-closed"
          className="flex flex-col items-center justify-center bg-white w-full h-full rounded-2xl shadow-lg border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center p-6">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Talk-A-Tive</h3>
            <p className="text-gray-500">Select a chat from the sidebar or start a new conversation</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbox;