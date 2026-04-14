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
import { FaClock, FaStar } from "react-icons/fa";

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

export default function MyLibraryPage() {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        // IMPORTANT: same key as Player page
        const saved = JSON.parse(localStorage.getItem("myLibrary") || "[]");
        setSavedBooks(saved);

        const [selected, recommended, suggested] = await Promise.all([
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
          ).then((res) => res.json()),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
          ).then((res) => res.json()),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
          ).then((res) => res.json()),
        ]);

        const allBooks = [
          ...(Array.isArray(selected) ? selected : [selected]),
          ...(Array.isArray(recommended) ? recommended : []),
          ...(Array.isArray(suggested) ? suggested : []),
        ];

        const savedIds = new Set(saved.map((book: Book) => String(book.id)));
        const finished = allBooks.filter(
          (book: Book) => !savedIds.has(String(book.id))
        );

        setFinishedBooks(finished.slice(0, 5));
      } catch (error) {
        console.error("Error loading library:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  const formatDuration = (bookId: string) => {
    const durations: Record<string, string> = {
      "1": "03:22",
      "2": "04:52",
      "3": "02:48",
      "4": "04:40",
      "5": "03:24",
    };

    return durations[String(bookId)] || "03:24";
  };

  const renderBookCard = (book: Book) => (
    <Link
      href={`/player/${book.id}`}
      className="my-library__book-card"
      key={book.id}
    >
      <div className="my-library__book-image-wrap">
        <div className="my-library__book-image-bg" />
        <img
          src={book.imageLink}
          alt={book.title}
          className="my-library__book-image"
        />
      </div>

      <h3 className="my-library__book-title">{book.title}</h3>
      <p className="my-library__book-author">{book.author}</p>
      <p className="my-library__book-subtitle">{book.subTitle}</p>

      <div className="my-library__book-meta">
        <span className="my-library__book-meta-item">
          <FaClock />
          {formatDuration(String(book.id))}
        </span>

        <span className="my-library__book-meta-item">
          <FaStar />
          {book.averageRating}
        </span>
      </div>
    </Link>
  );

  if (loading) {
    return <div className="for-you-page">Loading...</div>;
  }

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
            className="for-you__nav-link for-you__nav-link--clickable active"
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
          <button className="for-you__nav-link" type="button">
            <FiSettings />
            <span>Settings</span>
          </button>

          <button className="for-you__nav-link" type="button">
            <FiHelpCircle />
            <span>Help & Support</span>
          </button>

          <button className="for-you__nav-link" type="button">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="for-you__main">
        <div className="for-you__topbar">
          <div className="for-you__search">
            <input type="text" placeholder="Search for books" />
            <button type="button">
              <FiSearch />
            </button>
          </div>
        </div>

        <div className="my-library">
          <section className="my-library__section">
            <h2 className="my-library__section-title">Saved Books</h2>
            <p className="my-library__section-count">
              {savedBooks.length} {savedBooks.length === 1 ? "item" : "items"}
            </p>

            {savedBooks.length === 0 ? (
              <div className="my-library__empty-state">
                <h3>Save your favorite books!</h3>
                <p>When you save a book, it will appear here.</p>
              </div>
            ) : (
              <div className="my-library__saved-grid">
                {savedBooks.map(renderBookCard)}
              </div>
            )}
          </section>

          <section className="my-library__section">
            <h2 className="my-library__section-title">Finished</h2>
            <p className="my-library__section-count">
              {finishedBooks.length}{" "}
              {finishedBooks.length === 1 ? "item" : "items"}
            </p>

            <div className="my-library__grid">
              {finishedBooks.map(renderBookCard)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}