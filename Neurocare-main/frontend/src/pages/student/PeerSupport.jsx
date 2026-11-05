// src/pages/student/PeerSupport.jsx
import React, { Suspense, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth.js"; // adjust if your path differs
import { useNavigate, useParams } from "react-router-dom";
import ChatProvider from "../../components/chat/Context/ChatProvider.jsx";

const Chatpage = React.lazy(() => import("../../components/chat/Chatpage.jsx")); // your Chatpage (entry)

const PeerSupport = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { studentId } = useParams();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [loading, currentUser, navigate]);

  // Put user in localStorage for the chat provider (it reads from localStorage)
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (e) {
        console.warn("Could not write userInfo to localStorage for chat:", e);
      }
    }
  }, [currentUser]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center">Please login to access Peer Support.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-4">Peer Support</h1>

        <ChatProvider>
          <Suspense fallback={<div>Loading chat...</div>}>
            <Chatpage />
          </Suspense>
        </ChatProvider>
      </div>
    </div>
  );
};

export default PeerSupport;
