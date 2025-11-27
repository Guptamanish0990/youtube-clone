
// ==================== app/gaming/page.js ====================
"use client";

export default function GamingPage() {
  const games = Array(12).fill(null).map((_, i) => ({
    id: i,
    title: `Gaming Stream ${i + 1}`,
    streamer: `Streamer ${i + 1}`,
    viewers: `${Math.floor(Math.random() * 10)}K`,
    live: Math.random() > 0.5
  }));

  return (
    <div className="w-full">
      <div className="p-6 border-b border-[#272727]">
        <h1 className="text-2xl font-bold">Gaming</h1>
        <p className="text-gray-400 mt-2">Watch gaming content and live streams</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game) => (
            <div key={game.id} className="cursor-pointer group">
              <div className="relative bg-[#272727] rounded-xl overflow-hidden aspect-video mb-3">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🎮</div>
                {game.live && (
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs font-semibold">
                  {game.viewers} watching
                </div>
              </div>
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{game.title}</h3>
              <p className="text-xs text-gray-400">{game.streamer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}