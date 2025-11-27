'use client'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import VideoGrid from './VideoGrid'
import Categories from './Categories'
import { fetchPopularVideos } from '../lib/youtube'
import { mockVideos } from '../data/mockData'

export default function HomeClient() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        // Try to fetch from YouTube API first
        const data = await fetchPopularVideos()
        if (data && data.items) {
          setVideos(data.items)
        } else {
          // Fallback to mock data
          setVideos(mockVideos)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        // Use mock data as fallback
        setVideos(mockVideos)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(video => 
        video.snippet?.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        video.snippet?.description.toLowerCase().includes(selectedCategory.toLowerCase())
      )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 ml-60">
          <Categories 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <div className="p-6">
            <VideoGrid videos={filteredVideos} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  )
}