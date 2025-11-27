
// ==================== app/channel/page.js ====================
"use client";

export default function ChannelPage() {
  return (
    <div className="w-full">
      {/* Channel Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600"></div>

      {/* Channel Info */}
      <div className="p-6 border-b border-[#272727]">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-4xl -mt-16">
            U
          </div>
          <div className="flex-1 pt-4">
            <h1 className="text-3xl font-bold">Your Channel</h1>
            <p className="text-gray-400 mt-1">@yourchannel</p>
            <p className="text-gray-400">0 subscribers • 0 videos</p>
            <button className="mt-4 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition">
              Customize channel
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#272727]">
        <div className="flex gap-8 px-6">
          {['Home', 'Videos', 'Shorts', 'Playlists', 'Community', 'About'].map((tab, i) => (
            <button
              key={tab}
              className={`py-4 text-sm font-medium border-b-2 transition ${
                i === 0 ? 'border-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center py-20">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-xl font-semibold mb-2">Create content on any device</h2>
        <p className="text-gray-400 mb-6">Upload and record at home or on the go. Everything you make public will appear here.</p>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition">
          Create
        </button>
      </div>
    </div>
  );
}
