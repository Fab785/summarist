"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import LoginModal from "../components/LoginModal";
import {
  FiEdit3,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
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
  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDraggingSaved, setIsDraggingSaved] = useState(false);
  const [isDraggingFinished, setIsDraggingFinished] = useState(false);

  const savedCarouselRef = useRef<HTMLDivElement | null>(null);
  const finishedCarouselRef = useRef<HTMLDivElement | null>(null);

  const isPointerDownRef = useRef(false);
  const activeCarouselRef = useRef<"saved" | "finished" | null>(null);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const syncLoginState = () => {
      const storedLogin = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(storedLogin !== "false");
    };

    const loadLibrary = async () => {
      const startTime = Date.now();

      try {
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

        setFinishedBooks(finished);
      } catch (error) {
        console.error("Error loading library:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const MIN_LOADING_TIME = 700;

        if (elapsed < MIN_LOADING_TIME) {
          setTimeout(() => {
            setIsLoading(false);
          }, MIN_LOADING_TIME - elapsed);
        } else {
          setIsLoading(false);
        }
      }
    };

    syncLoginState();
    loadLibrary();

    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerDownRef.current || !activeCarouselRef.current) return;

      const carousel =
        activeCarouselRef.current === "saved"
          ? savedCarouselRef.current
          : finishedCarouselRef.current;

      if (!carousel) return;

      event.preventDefault();

      const dx = event.pageX - startXRef.current;

      if (Math.abs(dx) > 4) {
        hasDraggedRef.current = true;

        if (activeCarouselRef.current === "saved") {
          setIsDraggingSaved(true);
        } else {
          setIsDraggingFinished(true);
        }
      }

      carousel.scrollLeft = scrollLeftRef.current - dx * 1.6;
    };

    const handleMouseUp = () => {
      isPointerDownRef.current = false;
      activeCarouselRef.current = null;

      setTimeout(() => {
        setIsDraggingSaved(false);
        setIsDraggingFinished(false);
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
    type: "saved" | "finished"
  ) => {
    if (event.button !== 0) return;

    const carousel =
      type === "saved" ? savedCarouselRef.current : finishedCarouselRef.current;

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
    type: "saved" | "finished"
  ) => {
    const carousel =
      type === "saved" ? savedCarouselRef.current : finishedCarouselRef.current;

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
      href={`/book/${book.id}`}
      className="my-library__book-card"
      key={book.id}
      onClick={(e) => {
        if (hasDraggedRef.current || isDraggingSaved || isDraggingFinished) {
          e.preventDefault();
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
    >
      <div className="my-library__book-image-wrap">
        <div className="my-library__book-image-bg" />
        <img
          src={book.imageLink}
          alt={book.title}
          className="my-library__book-image"
          draggable={false}
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

  const renderSkeletonCard = (key: number) => (
    <div
      className="my-library__book-card my-library__skeleton-card-wrap"
      key={key}
    >
      <div className="my-library__book-image-wrap">
        <div className="my-library__skeleton-circle" />
        <div className="my-library__skeleton-book" />
      </div>

      <div className="my-library__skeleton-line my-library__skeleton-line--title" />
      <div className="my-library__skeleton-line my-library__skeleton-line--author" />
      <div className="my-library__skeleton-line my-library__skeleton-line--subtitle" />

      <div className="my-library__book-meta">
        <div className="my-library__skeleton-line my-library__skeleton-line--meta" />
      </div>
    </div>
  );

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

      {isMobileMenuOpen && (
        <div className="for-you__mobile-overlay" onClick={closeMobileMenu} />
      )}

      <div
        className={`for-you__mobile-sidebar ${
          isMobileMenuOpen ? "is-open" : ""
        }`}
      >
        <div className="for-you__mobile-sidebar-top">
          <div className="for-you__logo">
            <img src="/assets/logo.png" alt="Summarist" />
          </div>

          <button
            className="for-you__mobile-close-btn"
            type="button"
            onClick={closeMobileMenu}
          >
            <FiX />
          </button>
        </div>

        <nav className="for-you__nav">
          <Link
            href="/for-you"
            className="for-you__nav-link for-you__nav-link--clickable"
            onClick={closeMobileMenu}
          >
            <HiOutlineHome />
            <span>For you</span>
          </Link>

          <Link
            href="/my-library"
            className="for-you__nav-link for-you__nav-link--clickable active"
            onClick={closeMobileMenu}
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
            className="for-you__nav-link for-you__nav-link--clickable"
            onClick={closeMobileMenu}
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
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          ) : (
            <button
              className="for-you__nav-link for-you__nav-link--clickable"
              type="button"
              onClick={() => {
                handleLoginClick();
                closeMobileMenu();
              }}
            >
              <FiLogOut />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <main className="for-you__main">
        <div className="for-you__topbar">
          <div className="for-you__search">
            <input type="text" placeholder="Search for books" />
            <button type="button">
              <FiSearch />
            </button>
          </div>

          <button
            className="for-you__mobile-menu-btn"
            type="button"
            onClick={openMobileMenu}
          >
            <FiMenu />
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="settings-page">
            <h1 className="settings-page__title">My Library</h1>

            <div className="settings-page__logged-out">
              <img
                src="/assets/login.webp"
                alt="Login"
                className="settings-page__logged-out-image"
              />

              <h2 className="settings-page__logged-out-title">
                Log in to your account to see your library.
              </h2>

              <button
                className="settings-page__login-button"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="my-library">
            <section className="my-library__section">
              <h2 className="my-library__section-title">Saved Books</h2>
              <p className="my-library__section-count">
                {savedBooks.length} {savedBooks.length === 1 ? "item" : "items"}
              </p>

              <div
                ref={savedCarouselRef}
                className={`my-library__carousel ${
                  isDraggingSaved ? "is-dragging" : ""
                }`}
                onMouseDown={(e) => handleCarouselMouseDown(e, "saved")}
                onWheel={(e) => handleCarouselWheel(e, "saved")}
                onDragStart={(e) => e.preventDefault()}
              >
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) =>
                    renderSkeletonCard(index)
                  )
                ) : savedBooks.length === 0 ? (
                  <div className="my-library__empty-state">
                    <h3>Save your favorite books!</h3>
                    <p>When you save a book, it will appear here.</p>
                  </div>
                ) : (
                  savedBooks.map(renderBookCard)
                )}
              </div>
            </section>

            <section className="my-library__section">
              <h2 className="my-library__section-title">Finished</h2>
              <p className="my-library__section-count">
                {isLoading
                  ? "Loading..."
                  : `${finishedBooks.length} ${
                      finishedBooks.length === 1 ? "item" : "items"
                    }`}
              </p>

              <div
                ref={finishedCarouselRef}
                className={`my-library__carousel ${
                  isDraggingFinished ? "is-dragging" : ""
                }`}
                onMouseDown={(e) => handleCarouselMouseDown(e, "finished")}
                onWheel={(e) => handleCarouselWheel(e, "finished")}
                onDragStart={(e) => e.preventDefault()}
              >
                {isLoading
                  ? Array.from({ length: 13 }).map((_, index) =>
                      renderSkeletonCard(index + 100)
                    )
                  : finishedBooks.map(renderBookCard)}
              </div>
            </section>
          </div>
        )}
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </div>
  );
}