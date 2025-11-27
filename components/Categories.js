'use client'
import { useRef, useState } from 'react'

const categories = [
  'All', 'Music', 'Gaming', 'Live', 'Comedy', 'Trailers', 
  'Cooking', 'Beauty', 'Sports', 'Learning', 'Fashion',
  'News', 'Technology', 'Travel', 'Podcasts'
]

export default function Categories({ selectedCategory, onCategorySelect }) {
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollLeft += direction * scrollAmount
      
      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftArrow(scrollRef.current.scrollLeft > 0)
          setShowRightArrow(
            scrollRef.current.scrollLeft < 
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          )
        }
      }, 300)
    }
  }

  return (
    <div className="relative bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 w-12 bg-white dark:bg-[#0f0f0f] flex items-center justify-center z-10"
        >
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Categories */}
      <div 
        ref={scrollRef}
        className="flex space-x-3 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 smooth-transition ${
              selectedCategory === category
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#272727] dark:text-gray-200 dark:hover:bg-[#3f3f3f]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 w-12 bg-white dark:bg-[#0f0f0f] flex items-center justify-center z-10"
        >
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}