import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSender, getSenderFull } from "./config/ChatLogics.js";
import ChatLoading from "./ChatLoading.jsx";
import GroupChatModal from "./miscellaneous/GroupChatModal.jsx";
import { ChatState } from "./Context/ChatProvider.jsx";
import { axiosInstance } from "../../lib/api.js";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        withCredentials: true,
      };

      const { data } = await axiosInstance.get("/chat", config);
      setChats(data);
    } catch (error) {
      console.error("❌ Failed to fetch chats", error);
    }
  };

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("userInfo"));
      setLoggedUser(u);
    } catch (error) {
      console.error(error);
      setLoggedUser(null);
    }
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <motion.div 
      className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-xl font-semibold text-gray-800">My Conversations</h2>
        <GroupChatModal>
          <motion.button 
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-600 transition-colors shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">New Group</span>
          </motion.button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <div className="flex-1 p-3 bg-gray-50 overflow-y-auto">
        {chats ? (
          <div className="space-y-2">
            <AnimatePresence>
              {chats?.map((chat) => {
                const senderFull = !chat?.isGroupChat
                  ? getSenderFull(loggedUser, chat?.users)
                  : null;

                return (
                  <motion.div
                    key={chat?._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                      selectedChat?._id === chat?._id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedChat?._id === chat?._id
                            ? "bg-white/20"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {!chat?.isGroupChat ? (
                          senderFull?.profilePic ? (
                            <img
                              src={senderFull?.profilePic}
                              alt={getSender(loggedUser, chat?.users) || "User avatar"}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="font-semibold">
                              {getSender(loggedUser, chat?.users)?.charAt(0)}
                            </span>
                          )
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {!chat?.isGroupChat
                            ? getSender(loggedUser, chat?.users)
                            : chat?.chatName}
                        </p>

                        {chat?.latestMessage && (
                          <div>
                            <div>{senderFull?.username}</div>
                            <p
                              className={`text-xs truncate ${
                                selectedChat?._id === chat?._id
                                  ? "text-white/80"
                                  : "text-gray-500"
                              }`}
                            >
                              <b>{chat?.latestMessage?.sender?.name}: </b>
                              {chat?.latestMessage?.content?.length > 50
                                ? chat?.latestMessage?.content?.substring(0, 51) + "..."
                                : chat?.latestMessage?.content}
                            </p>
                          </div>
                        )}
                      </div>

                      {chat?.latestMessage && (
                        <div
                          className={`text-xs ${
                            selectedChat?._id === chat?._id
                              ? "text-white/60"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(chat?.latestMessage?.createdAt)?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </motion.div>
  );
};

export default MyChats;