"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface SearchItem {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default function SearchBar({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, items]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="搜索文献笔记和随笔…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card
            text-sm text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            transition-all duration-200"
        />
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {results.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={`/${item.type === "note" ? "notes" : "essays"}/${item.slug}`}
              className="block px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-1.5 py-0.5 rounded bg-accent-light text-accent">
                  {item.type === "note" ? "文献" : "随笔"}
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
      {focused && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-4 text-center text-sm text-muted-foreground z-50">
          未找到相关内容
        </div>
      )}
    </div>
  );
}
