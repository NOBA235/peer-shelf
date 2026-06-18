"use client";
import { useState, useEffect } from "react";

const coverCache = new Map<string, string | null>();

interface Props {
  title: string;
  isbn?: string | null;
  fallbackEmoji?: string;
  fallbackColor?: string;
  className?: string;
}

export default function BookCover({
  title, isbn,
  fallbackEmoji = "📚",
  fallbackColor = "#7c3aed",
  className = "w-14 h-[72px] sm:w-16 sm:h-20",
}: Props) {
  const cacheKey = isbn ?? title;
  const [coverUrl, setCoverUrl] = useState<string | null>(
    coverCache.has(cacheKey) ? coverCache.get(cacheKey)! : null
  );
  const [loaded,   setLoaded]   = useState(false);
  const [failed,   setFailed]   = useState(false);
  const [fetching, setFetching] = useState(!coverCache.has(cacheKey));

  useEffect(() => {
    if (coverCache.has(cacheKey)) {
      setCoverUrl(coverCache.get(cacheKey)!);
      setFetching(false);
      return;
    }
    const params = new URLSearchParams();
    if (isbn)  params.set("isbn",  isbn);
    else       params.set("title", title);

    fetch(`/api/book-cover?${params}`)
      .then(r => r.json())
      .then(data => {
        const url = data.url ?? null;
        coverCache.set(cacheKey, url);
        setCoverUrl(url);
      })
      .catch(() => {
        coverCache.set(cacheKey, null);
      })
      .finally(() => setFetching(false));
  }, [cacheKey, isbn, title]);

  const showImage = coverUrl && !failed;

  return (
    <div
      className={`${className} rounded-xl flex-shrink-0 overflow-hidden relative`}
      style={!showImage ? { background: fallbackColor + "18", border: `1px solid ${fallbackColor}28` } : undefined}
    >
      {showImage && (
        <img
          src={coverUrl}
          alt={title}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {(!showImage || !loaded) && (
        <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
          {fetching
            ? <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            : fallbackEmoji
          }
        </div>
      )}
    </div>
  );
}