import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBox from "../components/chatbot/ChatBox";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-chalk">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBox />
    </div>
  );
}
