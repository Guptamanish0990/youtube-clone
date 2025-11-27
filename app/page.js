"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchPopularVideos,
  fetchTrendingVideos,
  formatViews,
  getTimeAgo,
} from "@/lib/youtube";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const categories = [
    "All",
    "Gaming",
    "Music",
    "Live",
    "News",
    "Sports",
    "Comedy",
    "Technology",
    "Cooking",
    "Travel",
    "Education",
  ];

  // Load user + initial videos
  useEffect(() => {
    setIsClient(true);

    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push("/login");
      return;
    }

    loadVideos();
  }, [router]);

  // Load videos
  const loadVideos = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setVideos([]);
      setNextPageToken(null);
    } else {
      setLoading(true);
    }

    try {
      const data1 = await fetchPopularVideos(50);
      const all = [...(data1.items || [])];

      if (data1.nextPageToken) {
        const data2 = await fetchPopularVideos(50, data1.nextPageToken);
        all.push(...(data2.items || []));
        setNextPageToken(data2.nextPageToken);
      }

      const trending = await fetchTrendingVideos(50);
      all.push(...(trending.items || []));

      const unique = Array.from(new Map(all.map(v => [v.id, v])).values());
      setVideos(unique);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load more
  const loadMoreVideos = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await fetchPopularVideos(50, nextPageToken);
      if (data.items?.length) {
        setVideos(prev =>
          Array.from(
            new Map([...prev, ...data.items].map(v => [v.id, v])).values()
          )
        );
      }
      setNextPageToken(data.nextPageToken);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!isClient || !user) return null;

  return (
    <div className="w-full bg-black min-h-screen">

      {/* ✅ Categories Bar (this is perfect) */}
      <div className="sticky top-14 bg-[#0f0f0f] border-b border-[#272727] z-30">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-white text-black"
                  : "bg-[#272727] hover:bg-[#3f3f3f] text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Count */}
      {/* <div className="px-4 py-3 text-sm text-gray-400 border-b border-[#272727]">
        {videos.length > 0 && `${videos.length} videos loaded`}
      </div> */}

      {/* Content */}
      <div className="w-full">
        {loading ? (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div key={i}>
                <div className="aspect-video bg-[#272727] rounded-lg mb-3"></div>
                <div className="h-4 bg-[#272727] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#272727] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videos.map(video => (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                  className="cursor-pointer group"
                >
                  <div className="relative bg-[#272727] rounded-lg overflow-hidden aspect-video mb-2 group-hover:scale-[1.02] transition">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 rounded text-xs font-bold">
                      {video.duration}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold">
                      {video.channel?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-gray-300">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-400">{video.channel}</p>
                      <p className="text-xs text-gray-400">
                        {formatViews(video.views)} • {getTimeAgo(video.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {nextPageToken && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreVideos}
                  disabled={loadingMore}
                  className="bg-[#272727] hover:bg-[#3f3f3f] px-8 py-3 rounded-full text-sm"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
