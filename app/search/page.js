'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import VideoGrid from '../../components/VideoGrid'
import { searchVideos } from '../../lib/youtube'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return
      
      try {
        setLoading(true)
        const data = await searchVideos(query)
        setVideos(data?.items || [])
      } catch (error) {
        console.error('Error searching videos:', error)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    performSearch()
  }, [query])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="pt-14 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Search Results for: "{query}"
        </h1>
        <VideoGrid videos={videos} loading={loading} />
      </div>
    </div>
  )
}