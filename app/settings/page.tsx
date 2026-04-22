"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import {
  FiEdit3,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import LoginModal from "@/app/components/LoginModal";

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPlan, setUserPlan] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync login state
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPlan = localStorage.getItem("userPlan");

    setIsLoggedIn(storedLogin === "true");
    setUserEmail(storedEmail || "");
    setUserPlan(storedPlan || "");
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);

    // refresh state after login
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPlan = localStorage.getItem("userPlan");

    setIsLoggedIn(storedLogin === "true");
    setUserEmail(storedEmail || "");
    setUserPlan(storedPlan || "");
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <div className="for-you-page">
      {/* SIDEBAR */}
      <aside className="for-you__sidebar">
        <div className="for-you__logo">
          <img src="/assets/logo.png" alt="Summarist" />
        </div>

        <nav className="for-you__nav">
          <Link href="/for-you" className="for-you__nav-link">
            <HiOutlineHome />
            <span>For you</span>
          </Link>

          <Link href="/my-library" className="for-you__nav-link">
            <HiOutlineBookmark />
            <span>My Library</span>
          </Link>

          <div className="for-you__nav-link">
            <FiEdit3 />
            <span>Highlights</span>
          </div>

          <div className="for-you__nav-link">
            <FiSearch />
            <span>Search</span>
          </div>
        </nav>

        <div className="for-you__sidebar-bottom">
          <Link
            href="/settings"
            className="for-you__nav-link active"
          >
            <FiSettings />
            <span>Settings</span>
          </Link>

          <div className="for-you__nav-link">
            <FiHelpCircle />
            <span>Help & Support</span>
          </div>

          {isLoggedIn ? (
  <button
    className="for-you__nav-link for-you__nav-link--clickable"
    type="button"
    onClick={handleLogout}
  >
    <FiLogOut />
    <span>Logout</span>
  </button>
) : (
  <button
    className="for-you__nav-link for-you__nav-link--clickable"
    type="button"
    onClick={openLoginModal}
  >
    <FiLogOut />
    <span>Login</span>
  </button>
)}
        </div>
      </aside>

      {/* MAIN */}
      <main className="for-you__main">
        <div className="for-you__topbar">
          <div className="for-you__search">
            <input placeholder="Search for books" />
            <FaSearch />
          </div>
        </div>

        <div className="settings-page">
          <h1 className="settings-page__title">Settings</h1>

          {isLoggedIn ? (
            <div className="settings-page__content">
              <div className="settings-page__row">
                <h2>Your Subscription plan</h2>
                <p>{userPlan}</p>
              </div>

              <div className="settings-page__row">
                <h2>Email</h2>
                <p>{userEmail}</p>
              </div>
            </div>
          ) : (
            <div className="settings-page__logged-out">
              <img
                src="/assets/login.webp"
                alt="Login"
                className="settings-page__logged-out-image"
              />

              <h2 className="settings-page__logged-out-title">
                Log in to your account to see your details.
              </h2>

              <button
                className="settings-page__login-button"
                onClick={openLoginModal}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </main>

      {/* LOGIN MODAL */}
      <LoginModal
  isOpen={isLoginModalOpen}
  onClose={closeLoginModal}
  redirectTo="/settings"
/>
    </div>
  );
}