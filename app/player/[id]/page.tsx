"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineHome, HiOutlineBookmark } from "react-icons/hi";
import {
  FiEdit3,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";

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
  const [fontSize, setFontSize] = useState(16);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fallbackDuration, setFallbackDuration] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getFallbackDurationByTitle = (title: string) => {
    const durations: Record<string, number> = {
      "The Lean Startup": 203,
      "How to Win Friends and Influence People in the Digital Age": 204,
      "Can't Hurt Me": 292,
      Mastery: 280,
      "Atomic Habits": 204,
      "How to Talk to Anyone": 202,
    };

    return durations[title] || 0;
  };

  useEffect(() => {
    const fetchBook = async () => {
      const startTime = Date.now();

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

        if (matchedBook?.title) {
          setFallbackDuration(getFallbackDurationByTitle(matchedBook.title));
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      } finally {
        const elapsed = Date.now() - startTime;
        const MIN_LOADING_TIME = 500;

        if (elapsed < MIN_LOADING_TIME) {
          setTimeout(() => setLoading(false), MIN_LOADING_TIME - elapsed);
        } else {
          setLoading(false);
        }
      }
    };

    if (id) fetchBook();
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !book?.audioLink) return;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    audio.currentTime = 0;

    const updateDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [book?.audioLink]);

  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      const audio = audioRef.current;

      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }

        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        setCurrentTime(audio.currentTime);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      } else {
        audio.pause();
        setIsPlaying(false);
        setCurrentTime(audio.currentTime);
      }
    } catch (error) {
      console.error("Audio play failed:", error);
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const safeDuration =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration || fallbackDuration;

    const nextTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      safeDuration || 0
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleProgressClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const audio = audioRef.current;
    const displayDuration = duration || fallbackDuration;

    if (!audio || displayDuration === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * displayDuration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const displayDuration = duration || fallbackDuration;

  return (
    <div className="for-you-page player-layout">
      {isMobileMenuOpen && (
        <div
          className="player-page__mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`for-you__sidebar ${
          isMobileMenuOpen ? "player-page__mobile-sidebar-open" : ""
        }`}
      >
        <div className="player-page__mobile-sidebar-top">
          <div className="for-you__logo">
            <img src="/assets/logo.png" alt="Summarist" />
          </div>

          <button
            type="button"
            className="player-page__mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="player-page__sidebar-top">
          <nav className="for-you__nav">
            <Link
              href="/for-you"
              className="for-you__nav-link for-you__nav-link--clickable"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiOutlineHome />
              <span>For you</span>
            </Link>

            <Link
              href="/my-library"
              className="for-you__nav-link for-you__nav-link--clickable"
              onClick={() => setIsMobileMenuOpen(false)}
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

          <div className="player-page__font-controls">
            <button
              className={`player-page__font-btn ${
                fontSize === 16 ? "player-page__font-btn--active" : ""
              }`}
              onClick={() => setFontSize(16)}
              style={{ fontSize: "20px" }}
              type="button"
            >
              Aa
            </button>

            <button
              className={`player-page__font-btn ${
                fontSize === 18 ? "player-page__font-btn--active" : ""
              }`}
              onClick={() => setFontSize(18)}
              style={{ fontSize: "24px" }}
              type="button"
            >
              Aa
            </button>

            <button
              className={`player-page__font-btn ${
                fontSize === 22 ? "player-page__font-btn--active" : ""
              }`}
              onClick={() => setFontSize(22)}
              style={{ fontSize: "28px" }}
              type="button"
            >
              Aa
            </button>

            <button
              className={`player-page__font-btn ${
                fontSize === 26 ? "player-page__font-btn--active" : ""
              }`}
              onClick={() => setFontSize(26)}
              style={{ fontSize: "32px" }}
              type="button"
            >
              Aa
            </button>
          </div>
        </div>

        <div className="for-you__sidebar-bottom">
          <button className="for-you__nav-link" type="button">
            <FiSettings />
            <span>Settings</span>
          </button>

          <button className="for-you__nav-link" type="button">
            <FiHelpCircle />
            <span>Help &amp; Support</span>
          </button>

          <button className="for-you__nav-link" type="button">
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

          <button
            type="button"
            className="player-page__burger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>

        {loading ? (
          <div className="player-page__reader">
            <div className="player-page__reader-title skeleton-line skeleton-line--player-title" />
            <div className="player-page__divider" />
            <div className="player-page__text">
              <div className="skeleton-line skeleton-line--player-paragraph" />
              <div className="skeleton-line skeleton-line--player-paragraph" />
              <div className="skeleton-line skeleton-line--player-paragraph short" />
            </div>
          </div>
        ) : !book ? (
          <div className="player-page__reader">
            <h1 className="player-page__reader-title">Book not found</h1>
          </div>
        ) : (
          <>
            <div className="player-page__reader">
              <h1 className="player-page__reader-title">{book.title}</h1>
              <div className="player-page__divider" />

              <div
                className="player-page__text"
                style={{ fontSize: `${fontSize}px` }}
              >
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

            <audio
  ref={audioRef}
  src={book.audioLink}
  preload="metadata"
  onLoadedMetadata={(e) => {
    const audio = e.currentTarget;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  }}
  onTimeUpdate={(e) => {
    setCurrentTime(e.currentTarget.currentTime);
  }}
  onEnded={() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }}
/>

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
    <button
      className="player-page__audio-skip-btn"
      onClick={() => handleSkip(-10)}
      type="button"
    >
      <MdReplay10 />
    </button>

    <button
      className="player-page__audio-play"
      onClick={handlePlayPause}
      type="button"
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>

    <button
      className="player-page__audio-skip-btn"
      onClick={() => handleSkip(10)}
      type="button"
    >
      <MdForward10 />
    </button>
  </div>

  <div className="player-page__bottom-right">
    <span>{formatTime(currentTime)}</span>

    <div
      className="player-page__audio-progress"
      onClick={handleProgressClick}
    >
      <div
        className="player-page__audio-progress-fill"
        style={{
          width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
        }}
      >
        <div className="player-page__audio-thumb" />
      </div>
    </div>

    <span>{formatTime(duration)}</span>
  </div>
</div>
          </>
        )}
      </main>
    </div>
  );
}
