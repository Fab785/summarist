"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Features from "./components/Features";
import StatsSection from "./components/StatsSection";
import LoginModal from "./components/LoginModal";
import TestimonialsSection from "./components/TestimonialsSection";
import GrowthSection from "./components/GrowthSection";
import Footer from "./components/Footer";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <Landing onLoginClick={() => setIsLoginOpen(true)} />
      <Features />
      <StatsSection />
      <TestimonialsSection onLoginClick={() => setIsLoginOpen(true)} />
      <GrowthSection/>
      <Footer/>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}