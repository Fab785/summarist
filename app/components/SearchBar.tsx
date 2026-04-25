"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`
        );

        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="search-bar">
      <div className="for-you__search">
        <input
          type="text"
          placeholder="Search for books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button">
          <FaSearch />
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-bar__dropdown">
          {results.map((book) => (
            <Link
              href={`/book/${book.id}`}
              className="search-bar__item"
              key={book.id}
              onClick={() => {
                setSearch("");
                setIsOpen(false);
              }}
            >
              <img src={book.imageLink} alt={book.title} />
              <div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}