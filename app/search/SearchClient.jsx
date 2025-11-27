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
      <h1 className="text-lg font-bold mb-3">
        Search Results for: "{query}"
      </h1>

      {loading && <p>Loading…</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((v) => (
          <Link key={v.id} href={`/video/${v.id}`}>
            <img src={v.thumbnail} className="rounded" />
            <p className="text-sm mt-1">{v.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
