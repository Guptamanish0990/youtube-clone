// ==================== app/history/page.js ====================
"use client";

export default function HistoryPage() {
  const history = Array(20).fill(null).map((_, i) => ({
    id: i,
    title: `Video You Watched ${i + 1}`,
    channel: `Channel ${Math.floor(Math.random() * 10) + 1}`,
    views: `${Math.floor(Math.random() * 1000)}K`,
    watchedTime: `${Math.floor(Math.random() * 24)} hours ago`
  }));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-6 border-b border-[#272727]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Watch history</h1>
            <p className="text-gray-400 mt-2">Your viewing history</p>
          </div>
          <button className="bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition">
            Clear all watch history
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="p-6">
        <div className="space-y-4">
          {history.map((video) => (
            <div key={video.id} className="flex gap-4 hover:bg-[#272727] p-2 rounded-lg cursor-pointer transition">
              <div className="relative bg-[#272727] rounded-lg overflow-hidden w-48 h-28 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center text-3xl">📺</div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1.5 py-0.5 rounded text-xs font-semibold">
                  10:30
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                <p className="text-xs text-gray-400">{video.channel}</p>
                <p className="text-xs text-gray-400">{video.views} views</p>
                <p className="text-xs text-gray-400 mt-2">Watched {video.watchedTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}