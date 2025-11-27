// ==================== app/music/page.js ====================
"use client";

export default function MusicPage() {
  const playlists = Array(8).fill(null).map((_, i) => ({
    id: i,
    name: `Playlist ${i + 1}`,
    songs: Math.floor(Math.random() * 50) + 10
  }));

  return (
    <div className="w-full">
      <div className="p-6 border-b border-[#272727]">
        <h1 className="text-2xl font-bold">Music</h1>
        <p className="text-gray-400 mt-2">Discover music videos and playlists</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="cursor-pointer group">
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl overflow-hidden aspect-square mb-3 hover:scale-105 transition-transform">
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🎵</div>
              </div>
              <h3 className="text-sm font-medium">{playlist.name}</h3>
              <p className="text-xs text-gray-400">{playlist.songs} songs</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}