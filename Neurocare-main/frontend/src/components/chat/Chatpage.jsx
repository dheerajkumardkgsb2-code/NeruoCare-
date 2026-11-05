import React, { useState } from "react";
import { motion } from "framer-motion";
import Chatbox from "./Chatbox";
import MyChats from "./MyChats";
import SideDrawer from "./miscellaneous/SideDrawer";
import { ChatState } from "./Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <motion.div 
      className="w-full h-screen bg-gradient-to-br from-indigo-50 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {user && <SideDrawer />}
      <div className="flex justify-between w-full h-[calc(100vh-80px)] p-4 gap-4">
        {user && (
          <motion.div 
            className="flex-none w-full md:w-[30%]"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MyChats fetchAgain={fetchAgain} />
          </motion.div>
        )}
        {user && (
          <motion.div 
            className="flex-1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Chatpage;