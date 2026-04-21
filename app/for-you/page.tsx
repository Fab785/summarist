"use client";

import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import LoginModal from "../components/LoginModal";
import {
  FiEdit3,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
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

  const [isDraggingRecommended, setIsDraggingRecommended] = useState(false);
  const [isDraggingSuggested, setIsDraggingSuggested] = useState(false);

  const recommendedCarouselRef = useRef<HTMLDivElement | null>(null);
  const suggestedCarouselRef = useRef<HTMLDivElement | null>(null);

  const isPointerDownRef = useRef(false);
  const activeCarouselRef = useRef<"recommended" | "suggested" | null>(null);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

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
        setRecommendedBooks(
          Array.isArray(recommended) ? recommended.slice(0, 8) : []
        );
        setSuggestedBooks(
          Array.isArray(suggested) ? suggested.slice(0, 7) : []
        );
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerDownRef.current || !activeCarouselRef.current) return;

      const carousel =
        activeCarouselRef.current === "recommended"
          ? recommendedCarouselRef.current
          : suggestedCarouselRef.current;

      if (!carousel) return;

      event.preventDefault();

      const dx = event.pageX - startXRef.current;

      if (Math.abs(dx) > 4) {
        hasDraggedRef.current = true;

        if (activeCarouselRef.current === "recommended") {
          setIsDraggingRecommended(true);
        } else {
          setIsDraggingSuggested(true);
        }
      }

      carousel.scrollLeft = scrollLeftRef.current - dx * 1.6;
    };

    const handleMouseUp = () => {
      isPointerDownRef.current = false;
      activeCarouselRef.current = null;

      setTimeout(() => {
        setIsDraggingRecommended(false);
        setIsDraggingSuggested(false);
        hasDraggedRef.current = false;
      }, 0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleCarouselMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    type: "recommended" | "suggested"
  ) => {
    if (event.button !== 0) return;

    const carousel =
      type === "recommended"
        ? recommendedCarouselRef.current
        : suggestedCarouselRef.current;

    if (!carousel) return;

    event.preventDefault();

    isPointerDownRef.current = true;
    activeCarouselRef.current = type;
    hasDraggedRef.current = false;
    startXRef.current = event.pageX;
    scrollLeftRef.current = carousel.scrollLeft;
  };

  const handleCarouselWheel = (
    event: React.WheelEvent<HTMLDivElement>,
    type: "recommended" | "suggested"
  ) => {
    const carousel =
      type === "recommended"
        ? recommendedCarouselRef.current
        : suggestedCarouselRef.current;

    if (!carousel) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      carousel.scrollLeft += event.deltaY;
    }
  };

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
      <Link
  href={`/book/${book.id}`}
  key={book.id}
  className="for-you__book-card"
  onClick={(e) => {
    if (
      hasDraggedRef.current ||
      isDraggingRecommended ||
      isDraggingSuggested
    ) {
      e.preventDefault();
    }
  }}
  onDragStart={(e) => e.preventDefault()}
  draggable={false}
>
  {!isLoggedIn && book.subscriptionRequired && (
    <span className="for-you__premium-pill">Premium</span>
  )}

  <div className="for-you__book-image-wrapper">
    <div className="for-you__book-image-bg" />

    <img
      src={book.imageLink}
      alt={book.title}
      className="for-you__book-image"
      draggable={false}
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
          <Link
            href="/for-you"
            className="for-you__nav-link for-you__nav-link--clickable active"
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
          <Link
            href="/settings"
            className="for-you__nav-link for-you__nav-link--clickable"
          >
            <FiSettings />
            <span>Settings</span>
          </Link>

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
              onClick={handleLoginClick}
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

        <div className="for-you__content">
          <section className="for-you__section">
            <h2 className="for-you__section-title">Selected just for you</h2>

            {selectedBook && (
              <Link
                href={`/book/${selectedBook.id}`}
                className="for-you__selected-card"
              >
                <div className="for-you__selected-left">
                  <p className="for-you__selected-subtitle">
                    {selectedBook.subTitle}
                  </p>
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
                  <h3 className="for-you__selected-title">
                    {selectedBook.title}
                  </h3>
                  <p className="for-you__selected-author">
                    {selectedBook.author}
                  </p>

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
            <p className="for-you__section-subtitle">
              We think you&apos;ll like these
            </p>

            <div
              ref={recommendedCarouselRef}
              className={`for-you__books-row ${
                isDraggingRecommended ? "is-dragging" : ""
              }`}
              onMouseDown={(e) => handleCarouselMouseDown(e, "recommended")}
              onWheel={(e) => handleCarouselWheel(e, "recommended")}
              onDragStart={(e) => e.preventDefault()}
            >
              {recommendedBooks.map(renderBookCard)}
            </div>
          </section>

          <section className="for-you__section">
            <h2 className="for-you__section-title">Suggested Books</h2>
            <p className="for-you__section-subtitle">Browse more great reads</p>

            <div
              ref={suggestedCarouselRef}
              className={`for-you__books-row ${
                isDraggingSuggested ? "is-dragging" : ""
              }`}
              onMouseDown={(e) => handleCarouselMouseDown(e, "suggested")}
              onWheel={(e) => handleCarouselWheel(e, "suggested")}
              onDragStart={(e) => e.preventDefault()}
            >
              {suggestedBooks.map(renderBookCard)}
            </div>
          </section>
        </div>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </div>
  );
}