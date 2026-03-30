"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Features from "./components/Features";
import LoginModal from "./components/LoginModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <Landing onLoginClick={() => setIsLoginOpen(true)} />
      <Features />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}