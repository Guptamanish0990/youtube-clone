// ==================== app/subscriptions/page.js ====================
"use client";

import { useEffect, useState } from "react";

export default function SubscriptionsPage() {
  const channels = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i,
      name: `Channel ${i + 1}`,
      initial: String.fromCharCode(65 + i),
    }));

  // FIX: no random data on server
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Generate random videos ONLY on client
    const generated = Array(16)
      .fill(null)
      .map((_, i) => ({
        id: i,
        title: `Video from Channel ${i + 1}`,
        channel: `Channel ${Math.floor(Math.random() * 10) + 1}`,
        views: `${Math.floor(Math.random() * 500)}K`,
        time: `${Math.floor(Math.random() * 24)}h ago`,
      }));

    setVideos(generated);
  }, []);

  return (
    <div className="w-full">
      <div className="p-3 sm:p-4 md:p-6 border-b border-[#272727]">
        <h1 className="text-xl sm:text-2xl font-bold">Subscriptions</h1>
        <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">
          Latest from subscriptions
        </p>
      </div>

      {/* Channels Row */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-[#272727]">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex flex-col items-center min-w-[60px] sm:min-w-[80px] cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-base sm:text-lg mb-1.5 sm:mb-2 hover:scale-110 transition-transform">
                {channel.initial}
              </div>
              <p className="text-[10px] sm:text-xs text-center line-clamp-1 w-full">
                {channel.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="p-2 sm:p-4 md:p-6">
        {videos.length === 0 ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {videos.map((video) => (
              <div key={video.id} className="cursor-pointer group">
                <div className="relative bg-[#272727] rounded-lg sm:rounded-xl overflow-hidden aspect-video mb-2 sm:mb-3">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
                    📺
                  </div>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black bg-opacity-80 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold">
                    12:34
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 px-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs sm:text-sm">
                    {video.channel[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-0.5 sm:mb-1">
                      {video.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {video.channel}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {video.views} • {video.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
