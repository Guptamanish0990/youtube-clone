// Mock data for development/demo purposes
const mockVideos = Array.from({ length: 12 }, (_, i) => ({
  id: { videoId: `video-${i + 1}` },
  snippet: {
    title: `Amazing Video Tutorial ${i + 1}`,
    description: 'This is a sample video description',
    thumbnails: {
      medium: { url: `https://picsum.photos/320/180?random=${i}` },
      high: { url: `https://picsum.photos/480/360?random=${i}` }
    },
    channelTitle: `Tech Channel ${(i % 5) + 1}`,
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    channelId: `channel-${(i % 5) + 1}`
  },
  statistics: {
    viewCount: Math.floor(Math.random() * 1000000).toString()
  }
}));

const mockShorts = Array.from({ length: 8 }, (_, i) => ({
  id: { videoId: `short-${i + 1}` },
  snippet: {
    title: `Trending Short ${i + 1}`,
    thumbnails: {
      medium: { url: `https://picsum.photos/180/320?random=${i + 100}` }
    },
    channelTitle: `Creator ${i + 1}`,
    publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  statistics: {
    viewCount: Math.floor(Math.random() * 500000).toString()
  }
}));

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function fetchVideos() {
  // Use mock data if no API key
  if (!API_KEY) {
    console.warn('⚠️ Using mock data (YouTube API key not configured)');
    return { items: mockVideos };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return { items: mockVideos };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { items: mockVideos };
  }
}

export async function searchVideos(query) {
  // Use filtered mock data if no API key
  if (!API_KEY) {
    console.warn('⚠️ Using mock search results (YouTube API key not configured)');
    const filtered = mockVideos.filter(v => 
      v.snippet.title.toLowerCase().includes(query.toLowerCase())
    );
    return { items: filtered.length > 0 ? filtered : mockVideos };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=12&type=video&key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return { items: mockVideos };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching videos:', error);
    return { items: mockVideos };
  }
}

export async function fetchShorts() {
  // Use mock shorts if no API key
  if (!API_KEY) {
    console.warn('⚠️ Using mock shorts (YouTube API key not configured)');
    return { items: mockShorts };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoDuration=short&maxResults=8&key=${API_KEY}`
    );
    
    if (!response.ok) {
      return { items: mockShorts };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shorts:', error);
    return { items: mockShorts };
  }
}

export async function fetchVideoById(videoId) {
  // Mock single video data
  if (!API_KEY) {
    const mockVideo = {
      id: videoId,
      snippet: {
        title: 'Sample Video Title',
        description: 'This is a detailed video description...',
        channelTitle: 'Sample Channel',
        publishedAt: new Date().toISOString(),
        thumbnails: {
          high: { url: 'https://picsum.photos/1280/720' }
        }
      },
      statistics: {
        viewCount: '1234567',
        likeCount: '12345',
        commentCount: '1234'
      }
    };
    return { items: [mockVideo] };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      return { items: [] };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video:', error);
    return { items: [] };
  }
}