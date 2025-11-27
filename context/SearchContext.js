'use client'
import { createContext, useState, useContext } from 'react'

// Create context with default values
export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: () => {},
  searchResults: [],
  setSearchResults: () => {},
  isSearching: false,
  setIsSearching: () => {}
})

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

// Custom hook for using search context
export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}