export default function LibraryPage() {
  return (
    <div className="pt-16 px-6 min-h-screen text-white bg-[#0f0f0f]">

      <h1 className="text-3xl font-bold mb-6">Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Watch Later */}
        <div className="bg-[#1b1b1b] p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Watch Later</h2>
          <p className="text-gray-400 text-sm mb-4">0 saved videos</p>
          <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">No videos yet</span>
          </div>
        </div>

        {/* Playlists */}
        <div className="bg-[#1b1b1b] p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Playlists</h2>
          <p className="text-gray-400 text-sm mb-4">Your saved playlists</p>
          <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">No playlists found</span>
          </div>
        </div>

        {/* Downloads */}
        <div className="bg-[#1b1b1b] p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Downloads</h2>
          <p className="text-gray-400 text-sm mb-4">Offline videos</p>
          <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Nothing downloaded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
