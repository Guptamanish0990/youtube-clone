// ==================== app/shorts/page.js - UNLIMITED SHORTS ====================
"use client";

import { useEffect, useState } from "react";
import { fetchShorts, formatViews } from "@/lib/youtube";
import Link from "next/link";
import { RefreshCw, Play } from "lucide-react";

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadShorts = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setShorts([]);
      setNextPageToken(null);
    } else {
      setLoading(true);
    }

    try {
      // Load multiple batches
      const data1 = await fetchShorts(50);
      let allShorts = [...(data1.items || [])];
      
      if (data1.nextPageToken) {
        const data2 = await fetchShorts(50, data1.nextPageToken);
        allShorts.push(...(data2.items || []));
        setNextPageToken(data2.nextPageToken);
      }

      // Remove duplicates
      const uniqueShorts = Array.from(
        new Map(allShorts.map(short => [short.id, short])).values()
      );

      setShorts(uniqueShorts);
    } catch (error) {
      console.error("Error loading shorts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreShorts = async () => {
    if (loadingMore || !nextPageToken) return;
    
    setLoadingMore(true);
    try {
      const data = await fetchShorts(50, nextPageToken);
      
      if (data.items && data.items.length > 0) {
        setShorts(prev => {
          const combined = [...prev, ...data.items];
          return Array.from(
            new Map(combined.map(short => [short.id, short])).values()
          );
        });
        setNextPageToken(data.nextPageToken);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadShorts();
  }, []);

  return (
    <div className="w-full">
      <div className="p-3 sm:p-4 md:p-6 border-b border-[#272727]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-red-600 p-1.5 sm:p-2 rounded-lg">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24">
                <path d="M10 20H14V4H10V20ZM4 20H8V12H4V20ZM16 9V20H20V9H16Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Shorts</h1>
              <p className="text-gray-400 text-xs sm:text-sm">{shorts.length} shorts loaded</p>
            </div>
          </div>
          
          <button
            onClick={() => loadShorts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f]"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline text-sm">Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-2 sm:p-4 md:p-6">
        {loading ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
            {[...Array(21)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#272727] rounded-lg aspect-[9/16] mb-1.5"></div>
                <div className="h-3 bg-[#272727] rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
              {shorts.map((short) => (
                <Link key={short.id} href={`/video/${short.id}`} className="group">
                  <div className="relative bg-[#272727] rounded-lg overflow-hidden aspect-[9/16] mb-1.5 sm:mb-2 hover:scale-105 transition-transform">
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-3">
                        <Play size={24} className="fill-black text-black" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      Shorts
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 rounded text-[10px] font-bold">
                      {short.duration}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium line-clamp-2 px-0.5">
                    {short.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 px-0.5">
                    {formatViews(short.views)} views
                  </p>
                </Link>
              ))}
            </div>

            {nextPageToken && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreShorts}
                  disabled={loadingMore}
                  className="bg-[#272727] hover:bg-[#3f3f3f] px-8 py-3 rounded-full font-medium text-sm"
                >
                  {loadingMore ? 'Loading...' : 'Load More Shorts'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}