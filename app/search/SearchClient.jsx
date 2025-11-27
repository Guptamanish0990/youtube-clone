"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchVideos } from "@/lib/youtube";
import Link from "next/link";

export default function SearchClient() {
  const params = useSearchParams();
  const query = params.get("q")?.trim() || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    async function load() {
      setLoading(true);
      const data = await searchVideos(query);
      setResults(data.items || []);
      setLoading(false);
    }

    load();
  }, [query]);

  return (
    <div className="text-white p-6">
      <h1 className="text-xl font-bold mb-3">
        Search Results for: "{query}"
      </h1>

      {loading && <p>Loading…</p>}

      {!loading && results.length === 0 && (
        <p>No videos found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map(video => (
          <Link key={video.id} href={`/video/${video.id}`} className="bg-[#111] p-3 rounded">
            <img src={video.thumbnail} className="rounded mb-2" />
            <h3 className="font-semibold">{video.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
