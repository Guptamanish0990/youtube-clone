'use client'
import { useRouter } from 'next/navigation'

export default function VideoCard({ video }) {
  const router = useRouter()
  const snippet = video.snippet
  const statistics = video.statistics

  const handleClick = () => {
    const videoId = video.id.videoId || video.id
    router.push(`/video/${videoId}`)
  }

  const formatViewCount = (views) => {
    if (!views) return '0 views'
    const num = parseInt(views)
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M views'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K views'
    }
    return num + ' views'
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' min ago'
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago'
    if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + ' days ago'
    if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + ' months ago'
    return Math.floor(diffInSeconds / 31536000) + ' years ago'
  }

  return (
    <div 
      className="bg-transparent rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative mb-3">
        <img
          src={snippet?.thumbnails?.medium?.url || '/thumbnail-placeholder.jpg'}
          alt={snippet?.title}
          className="w-full h-32 object-cover rounded-xl"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          10:30
        </div>
      </div>

      {/* Video Info */}
      <div className="flex space-x-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
            {snippet?.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
            {snippet?.channelTitle}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{formatViewCount(statistics?.viewCount)}</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(snippet?.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}