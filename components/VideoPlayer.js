'use client'

export default function VideoPlayer({ videoId, video }) {
  return (
    <div className="w-full bg-black rounded-xl overflow-hidden">
      {/* Simple fixed size iframe */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        className="w-full h-[500px] md:h-[600px] lg:h-[70vh]"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={video?.snippet?.title || 'YouTube Video'}
      />
      
      {/* Simple video info */}
      {video?.snippet && (
        <div className="p-4 bg-white dark:bg-[#0f0f0f]">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {video.snippet.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {video.snippet.channelTitle}
          </p>
        </div>
      )}
    </div>
  )
}