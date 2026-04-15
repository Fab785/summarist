"use client";

import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import LoginModal from "../components/LoginModal";
import { FiEdit3, FiSearch, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaClock, FaStar, FaPlay } from "react-icons/fa";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
};

export default function ForYouPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const syncLoginState = () => {
      const storedLogin = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(storedLogin !== "false");
    };

    syncLoginState();

    const fetchBooks = async () => {
      try {
        const selected = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
        ).then((res) => res.json());

        const recommended = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
        ).then((res) => res.json());

        const suggested = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
        ).then((res) => res.json());

        setSelectedBook(Array.isArray(selected) ? selected[0] : selected);
        setRecommendedBooks(Array.isArray(recommended) ? recommended : []);
        setSuggestedBooks(Array.isArray(suggested) ? suggested : []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    const storedLogin = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLogin !== "false");
  };

  const formatDuration = () => {
    return "00:00";
  };

  const renderBookCard = (book: Book) => {
    return (
      <Link href={`/book/${book.id}`} key={book.id} className="for-you__book-card">
        <div className="for-you__book-image-wrapper">
          {!isLoggedIn && book.subscriptionRequired && (
            <span className="for-you__premium-pill">Premium</span>
          )}

          <div className="for-you__book-image-bg" />

          <img
            src={book.imageLink}
            alt={book.title}
            className="for-you__book-image"
          />
        </div>

        <h3 className="for-you__book-title">{book.title}</h3>
        <p className="for-you__book-author">{book.author}</p>
        <p className="for-you__book-subtitle">{book.subTitle}</p>

        <div className="for-you__book-meta">
          <span className="for-you__book-meta-item">
            <FaClock />
            {formatDuration()}
          </span>
          <span className="for-you__book-meta-item">
            <FaStar />
            {book.averageRating}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="for-you-page">
      <aside className="for-you__sidebar">
        <div className="for-you__logo">
          <img src="/assets/logo.png" alt="Summarist" />
        </div>

        <nav className="for-you__nav">
        <Link href="/for-you" className="for-you__nav-link for-you__nav-link--clickable active">
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

{/* INACTIVE */}
<button
  className="for-you__nav-link for-you__nav-link--inactive"
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
>
  <FiEdit3 />
  <span>Highlights</span>
</button>

<button
  className="for-you__nav-link for-you__nav-link--inactive"
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
>
  <FiSearch />
  <span>Search</span>
</button>

</nav>

<div className="for-you__sidebar-bottom">
  <button
    className="for-you__nav-link for-you__nav-link--clickable"
    type="button"
  >
    <FiSettings />
    <span>Settings</span>
  </button>

  <button
    className="for-you__nav-link for-you__nav-link--inactive"
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <FiHelpCircle />
    <span>Help &amp; Support</span>
  </button>

{isLoggedIn ? (
  <button className="for-you__nav-link for-you__nav-link--clickable" type="button" onClick={handleLogout}>
    <FiLogOut />
    <span>Logout</span>
  </button>
) : (
  <button className="for-you__nav-link for-you__nav-link--clickable" type="button" onClick={handleLoginClick}>
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

        <div className="for-you__content">
          <section className="for-you__section">
            <h2 className="for-you__section-title">Selected just for you</h2>

            {selectedBook && (
              <Link href={`/book/${selectedBook.id}`} className="for-you__selected-card">
                <div className="for-you__selected-left">
                  <p className="for-you__selected-subtitle">{selectedBook.subTitle}</p>
                </div>

                <div className="for-you__selected-divider" />

                <div className="for-you__selected-center">
                  <div className="for-you__selected-image-bg" />
                  <img
                    src={selectedBook.imageLink}
                    alt={selectedBook.title}
                    className="for-you__selected-image"
                  />
                </div>

                <div className="for-you__selected-right">
                  <h3 className="for-you__selected-title">{selectedBook.title}</h3>
                  <p className="for-you__selected-author">{selectedBook.author}</p>

                  <div className="for-you__selected-audio">
                    <div className="for-you__selected-play">
                      <FaPlay />
                    </div>
                    <span>{formatDuration()}</span>
                  </div>
                </div>
              </Link>
            )}
          </section>

          <section className="for-you__section">
            <h2 className="for-you__section-title">Recommended For You</h2>
            <p className="for-you__section-subtitle">We think you&apos;ll like these</p>

            <div className="for-you__books-row">
              {recommendedBooks.slice(0, 5).map(renderBookCard)}
            </div>
          </section>

          <section className="for-you__section">
            <h2 className="for-you__section-title">Suggested Books</h2>
            <p className="for-you__section-subtitle">Browse more great reads</p>

            <div className="for-you__books-row">
              {suggestedBooks.slice(0, 5).map(renderBookCard)}
            </div>
          </section>
        </div>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
      />
    </div>
  );
}