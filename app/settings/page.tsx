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

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState("hanna@gmail.com");
  const [userPlan, setUserPlan] = useState("premium-plus");

  useEffect(() => {
    const syncAuthState = () => {
      const storedLogin = localStorage.getItem("isLoggedIn");
      const storedEmail = localStorage.getItem("userEmail");
      const storedPlan = localStorage.getItem("userPlan");

      setIsLoggedIn(storedLogin !== "false");
      setUserEmail(storedEmail || "hanna@gmail.com");
      setUserPlan(storedPlan || "premium-plus");
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "hanna@gmail.com");
    localStorage.setItem("userPlan", "premium-plus");

    setIsLoggedIn(true);
    setUserEmail("hanna@gmail.com");
    setUserPlan("premium-plus");
  };

  return (
    <div className="for-you-page">
      <aside className="for-you__sidebar">
        <div className="for-you__logo">
          <img src="/assets/logo.png" alt="Summarist" />
        </div>

        <nav className="for-you__nav">
          <Link
            href="/for-you"
            className="for-you__nav-link for-you__nav-link--clickable"
          >
            <HiOutlineHome />
            <span>For you</span>
          </Link>

          <Link
            href="/my-library"
            className="for-you__nav-link for-you__nav-link--clickable"
          >
            <HiOutlineBookmark />
            <span>My Library</span>
          </Link>

          <button
            className="for-you__nav-link for-you__nav-link--inactive"
            type="button"
          >
            <FiEdit3 />
            <span>Highlights</span>
          </button>

          <button
            className="for-you__nav-link for-you__nav-link--inactive"
            type="button"
          >
            <FiSearch />
            <span>Search</span>
          </button>
        </nav>

        <div className="for-you__sidebar-bottom">
          <Link
            href="/settings"
            className="for-you__nav-link for-you__nav-link--clickable active"
          >
            <FiSettings />
            <span>Settings</span>
          </Link>

          <button
            className="for-you__nav-link for-you__nav-link--inactive"
            type="button"
          >
            <FiHelpCircle />
            <span>Help &amp; Support</span>
          </button>

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
              onClick={handleLogin}
            >
              <FiLogOut />
              <span>Login</span>
            </button>
          )}
        </div>
      </aside>

      <main className="for-you__main">
        <div className="for-you__topbar">
          <div className="for-you__search">
            <input type="text" placeholder="Search for books" />
            <button type="button">
              <FaSearch />
            </button>
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
                src="/assets/settings-login.png"
                alt="Login to view settings"
                className="settings-page__logged-out-image"
              />

              <h2 className="settings-page__logged-out-title">
                Log in to your account to see your details.
              </h2>

              <button
                className="settings-page__login-button"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}