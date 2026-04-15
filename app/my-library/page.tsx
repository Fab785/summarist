"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const loadLibrary = async () => {
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
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    loadLibrary();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const carousel = carouselRef.current;
      if (!carousel || !isPointerDownRef.current) return;

      const dx = event.pageX - startXRef.current;

      if (Math.abs(dx) > 5) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      carousel.scrollLeft = scrollLeftRef.current - dx;
    };

    const handleMouseUp = () => {
      isPointerDownRef.current = false;

      setTimeout(() => {
        setIsDragging(false);
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = event.pageX;
    scrollLeftRef.current = carousel.scrollLeft;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      carousel.scrollLeft += event.deltaY;
    }
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
        if (hasDraggedRef.current || isDragging) {
          e.preventDefault();
        }
      }}
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
    <div className="my-library__book-card" key={key}>
      <div className="my-library__book-image-wrap">
        <div className="my-library__skeleton-image-bg" />
        <div className="my-library__skeleton-image" />
      </div>

      <div className="my-library__skeleton-title" />
      <div className="my-library__skeleton-author" />
      <div className="my-library__skeleton-subtitle" />

      <div className="my-library__book-meta">
        <div className="my-library__skeleton-meta" />
        <div className="my-library__skeleton-meta" />
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

            {isLoading ? (
              <div className="my-library__saved-grid">
                {Array.from({ length: 3 }).map((_, index) =>
                  renderSkeletonCard(index)
                )}
              </div>
            ) : savedBooks.length === 0 ? (
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
              {isLoading
                ? "Loading..."
                : `${finishedBooks.length} ${
                    finishedBooks.length === 1 ? "item" : "items"
                  }`}
            </p>

            <div
              ref={carouselRef}
              className={`my-library__carousel ${
                isDragging ? "is-dragging" : ""
              }`}
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            >
              {isLoading
                ? Array.from({ length: 13 }).map((_, index) =>
                    renderSkeletonCard(index + 100)
                  )
                : finishedBooks.map(renderBookCard)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}