"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineHome, HiOutlineBookmark, HiBookmark } from "react-icons/hi";
import {
  FiEdit3,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { FaStar, FaClock, FaBookOpen, FaMicrophone } from "react-icons/fa";
import LoginModal from "@/app/components/LoginModal";

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

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLogin === "true");
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
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

        const matchedBook = allBooks.find(
          (item: Book) => String(item.id) === String(id)
        );

        setBook(matchedBook || null);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    if (!book) return;

    const existingBooks = JSON.parse(localStorage.getItem("myLibrary") || "[]");
    const alreadySaved = existingBooks.some(
      (savedBook: Book) => String(savedBook.id) === String(book.id)
    );

    setIsSaved(alreadySaved);
  }, [book]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);

    const storedLogin = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLogin === "true");

    if (book) {
      const existingBooks = JSON.parse(localStorage.getItem("myLibrary") || "[]");
      const alreadySaved = existingBooks.some(
        (savedBook: Book) => String(savedBook.id) === String(book.id)
      );
      setIsSaved(alreadySaved);
    }
  };

  const requireLogin = (action: () => void) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    action();
  };

  const handleSaveBook = () => {
    if (!book) return;

    const existingBooks: Book[] = JSON.parse(
      localStorage.getItem("myLibrary") || "[]"
    );

    const alreadySaved = existingBooks.some(
      (savedBook) => String(savedBook.id) === String(book.id)
    );

    if (alreadySaved) {
      const updatedBooks = existingBooks.filter(
        (savedBook) => String(savedBook.id) !== String(book.id)
      );

      localStorage.setItem("myLibrary", JSON.stringify(updatedBooks));
      setIsSaved(false);
      return;
    }

    const updatedBooks = [...existingBooks, book];
    localStorage.setItem("myLibrary", JSON.stringify(updatedBooks));
    setIsSaved(true);
  };

  const handleProtectedSave = () => {
    requireLogin(handleSaveBook);
  };

  const handleReadOrListen = () => {
    requireLogin(() => {
      router.push(`/player/${book?.id}`);
    });
  };

  const formatDuration = () => {
    return "03:24";
  };

  if (loading) {
    return (
      <div className="for-you-page">
        <aside className="for-you__sidebar">
          <div className="for-you__logo">
            <img src="/assets/logo.png" alt="Summarist" />
          </div>
        </aside>
        <main className="for-you__main">
          <div className="book-details__content">Loading...</div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="for-you-page">
        <aside className="for-you__sidebar">
          <div className="for-you__logo">
            <img src="/assets/logo.png" alt="Summarist" />
          </div>
        </aside>

        <main className="for-you__main">
          <div className="book-details__content">
            <Link href="/for-you" className="book-details__back">
              ← Back
            </Link>
            <h1 className="book-details__not-found">Book not found</h1>
          </div>
        </main>
      </div>
    );
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

          <button
  className="for-you__nav-link for-you__nav-link--clickable"
  type="button"
  onClick={() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPlan");
      setIsLoggedIn(false);
      setIsSaved(false);
    } else {
      openLoginModal();
    }
  }}
>
  <FiLogOut />
  <span>{isLoggedIn ? "Logout" : "Login"}</span>
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

        <div className="book-details__content">
          <div className="book-details__hero">
            <div className="book-details__info">
              <h1 className="book-details__title">{book.title}</h1>
              <p className="book-details__author book-details__author--bold">
                {book.author}
              </p>
              <p className="book-details__subtitle">{book.subTitle}</p>

              <div className="book-details__divider" />

              <div className="book-details__stats">
                <div className="book-details__stat">
                  <FaStar />
                  <span>{book.averageRating} (608 ratings)</span>
                </div>

                <div className="book-details__stat">
                  <FaClock />
                  <span>{formatDuration()}</span>
                </div>

                <div className="book-details__stat">
                  <FaMicrophone />
                  <span>Audio &amp; Text</span>
                </div>

                <div className="book-details__stat">
                  <span>💡</span>
                  <span>{book.keyIdeas} Key ideas</span>
                </div>
              </div>

              <div className="book-details__divider" />

              <div className="book-details__actions">
                <button
                  type="button"
                  className="book-details__action-btn"
                  onClick={handleReadOrListen}
                >
                  <FaBookOpen />
                  <span>Read</span>
                </button>

                <button
                  type="button"
                  className="book-details__action-btn"
                  onClick={handleReadOrListen}
                >
                  <FaMicrophone />
                  <span>Listen</span>
                </button>
              </div>

              <button
                className="book-details__library-link"
                type="button"
                onClick={handleProtectedSave}
              >
                {isSaved ? <HiBookmark /> : <HiOutlineBookmark />}
                <span>
                  {isSaved ? "Saved in My Library" : "Add title to My Library"}
                </span>
              </button>
            </div>

            <div className="book-details__image-wrap">
              <div className="book-details__image-bg" />
              <img
                src={book.imageLink}
                alt={book.title}
                className="book-details__image"
              />
            </div>
          </div>

          <section className="book-details__section">
            <h2 className="book-details__section-title">What&apos;s it about?</h2>

            <div className="book-details__tags">
              {book.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="book-details__tag">
                  {tag}
                </span>
              ))}
            </div>

            <p className="book-details__text">{book.bookDescription}</p>
          </section>

          <section className="book-details__section">
            <h2 className="book-details__section-title">About the author</h2>
            <p className="book-details__text">{book.authorDescription}</p>
          </section>
        </div>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}