"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import { FiEdit3, FiSearch, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FaPlay, FaUndoAlt, FaRedoAlt } from "react-icons/fa";

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

export default function PlayerPage() {
  const params = useParams();
  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="player-loading">Loading...</div>;
  }

  if (!book) {
    return <div className="player-loading">Book not found</div>;
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

          <button className="for-you__nav-link for-you__nav-link--inactive" type="button">
            <FiEdit3 />
            <span>Highlights</span>
          </button>

          <button className="for-you__nav-link for-you__nav-link--inactive" type="button">
            <FiSearch />
            <span>Search</span>
          </button>
        </nav>

        <div className="player-page__font-controls">
          <button className="player-page__font-btn player-page__font-btn--active">Aa</button>
          <button className="player-page__font-btn">Aa</button>
          <button className="player-page__font-btn">Aa</button>
          <button className="player-page__font-btn">Aa</button>
        </div>

        <div className="for-you__sidebar-bottom">
          <button className="for-you__nav-link for-you__nav-link--clickable" type="button">
            <FiSettings />
            <span>Settings</span>
          </button>

          <button className="for-you__nav-link for-you__nav-link--inactive" type="button">
            <FiHelpCircle />
            <span>Help & Support</span>
          </button>

          <button className="for-you__nav-link for-you__nav-link--clickable" type="button">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="for-you__main player-page">
        <div className="for-you__topbar">
          <div className="for-you__search">
            <input type="text" placeholder="Search for books" />
            <button type="button">
              <FiSearch />
            </button>
          </div>
        </div>

        <div className="player-page__reader">
          <h1 className="player-page__reader-title">{book.title}</h1>
          <div className="player-page__divider" />
          <div className="player-page__text">
  {[book.summary, book.bookDescription, book.authorDescription]
    .filter(Boolean)
    .flatMap((text) => text.split("\n\n"))
    .map((paragraph, index) => {
      const isTitle = paragraph.startsWith("Part");

      return isTitle ? (
        <h3 key={index} className="player-page__section-title">
          {paragraph}
        </h3>
      ) : (
        <p key={index}>{paragraph}</p>
      );
    })}
</div>
        </div>

        <div className="player-page__bottom-bar">
          <div className="player-page__bottom-left">
            <img
              src={book.imageLink}
              alt={book.title}
              className="player-page__bottom-image"
            />
            <div className="player-page__bottom-book-info">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          </div>

          <div className="player-page__bottom-center">
            <button className="player-page__audio-btn" type="button">
              <FaUndoAlt />
            </button>

            <button className="player-page__audio-play" type="button">
              <FaPlay />
            </button>

            <button className="player-page__audio-btn" type="button">
              <FaRedoAlt />
            </button>
          </div>

          <div className="player-page__bottom-right">
            <span>00:00</span>
            <div className="player-page__audio-progress">
              <div className="player-page__audio-progress-fill" />
            </div>
            <span>03:24</span>
          </div>
        </div>
      </main>
    </div>
  );
}