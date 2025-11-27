// =======================================================
//  lib/youtube.js - UPDATED WITH BETTER ERROR HANDLING
// =======================================================

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ---------------- HELPER FUNCTIONS ----------------
function formatViews(views = "0") {
  const n = parseInt(views, 10);
  if (isNaN(n)) return "0";
  if (n >= 10000000) return (n / 10000000).toFixed(1) + " crore";
  if (n >= 100000) return (n / 100000).toFixed(1) + " lakh";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '0').replace('S', '').padStart(2, '0');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds}`;
  }
  return `${minutes || '0'}:${seconds}`;
}

// =======================================================
//  API FUNCTIONS - UPDATED WITH 403 ERROR HANDLING
// =======================================================

// 🔹 1. Fetch Popular Videos (with pagination)
export async function fetchPopularVideos(maxResults = 50, pageToken = null) {
  if (!API_KEY) {
    console.error("❌ YouTube API key not found.");
    return { items: [], nextPageToken: null };
  }

  try {
    let url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=${maxResults}&regionCode=IN&key=${API_KEY}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    console.log("🔄 Fetching popular videos...");
    const response = await fetch(url, { cache: "no-store" });

    // ✅ SPECIFIC 403 ERROR HANDLING
    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return { items: [], nextPageToken: null };
    }

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status} ${response.statusText}`);
      return { items: [], nextPageToken: null };
    }

    const data = await response.json();
    
    console.log(`✅ Popular videos loaded: ${data.items?.length || 0}`);
    
    return {
      items: data.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.high?.url,
        channel: item.snippet?.channelTitle,
        channelId: item.snippet?.channelId,
        views: item.statistics?.viewCount || "0",
        uploadedAt: item.snippet?.publishedAt,
        duration: parseDuration(item.contentDetails?.duration || "PT0S"),
        description: item.snippet?.description
      })) || [],
      nextPageToken: data.nextPageToken || null
    };
  } catch (error) {
    console.error("❌ Error fetching popular videos:", error.message);
    return { items: [], nextPageToken: null };
  }
}

// 🔹 5. Fetch Trending Videos (UPDATED)
export async function fetchTrendingVideos(maxResults = 50) {
  if (!API_KEY) {
    console.error("❌ YouTube API key not found.");
    return { items: [] };
  }

  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=${maxResults}&regionCode=IN&key=${API_KEY}`;
    
    console.log("🔄 Fetching trending videos...");
    const response = await fetch(url, { cache: "no-store" });

    // ✅ SPECIFIC 403 ERROR HANDLING
    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return { items: [] };
    }

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status} ${response.statusText}`);
      return { items: [] };
    }

    const data = await response.json();
    
    console.log(`✅ Trending videos loaded: ${data.items?.length || 0}`);
    
    return {
      items: data.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        channel: item.snippet?.channelTitle,
        views: item.statistics?.viewCount || "0",
        uploadedAt: item.snippet?.publishedAt,
        duration: parseDuration(item.contentDetails?.duration || "PT0S")
      })) || []
    };
  } catch (error) {
    console.error("❌ Error fetching trending videos:", error.message);
    return { items: [] };
  }
}

// 🔹 2. Fetch Shorts (with pagination) - SAME PATTERN
export async function fetchShorts(maxResults = 50, pageToken = null) {
  if (!API_KEY) {
    console.error("❌ YouTube API key not found.");
    return { items: [], nextPageToken: null };
  }

  try {
    let url = `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=%23shorts&type=video&videoDuration=short&regionCode=IN&key=${API_KEY}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url, { cache: "no-store" });

    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return { items: [], nextPageToken: null };
    }

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status}`);
      return { items: [], nextPageToken: null };
    }

    const data = await response.json();
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    if (!videoIds) return { items: [], nextPageToken: null };
    
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { cache: "no-store" }
    );
    
    const detailsData = await detailsResponse.json();
    
    return {
      items: detailsData.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.high?.url,
        channel: item.snippet?.channelTitle,
        channelId: item.snippet?.channelId,
        views: item.statistics?.viewCount || "0",
        uploadedAt: item.snippet?.publishedAt,
        duration: parseDuration(item.contentDetails?.duration || "PT0S"),
        tags: item.snippet?.tags || []
      })) || [],
      nextPageToken: data.nextPageToken || null
    };
  } catch (error) {
    console.error("❌ Error fetching shorts:", error.message);
    return { items: [], nextPageToken: null };
  }
}

// 🔹 3. Fetch Single Video Details - SAME PATTERN
export async function fetchVideoDetails(videoId) {
  if (!API_KEY || !videoId) {
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return null;
    }

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const item = data.items?.[0];
    
    if (!item) return null;
    
    return {
      id: item.id,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      channel: item.snippet?.channelTitle,
      channelId: item.snippet?.channelId,
      views: item.statistics?.viewCount || "0",
      likes: item.statistics?.likeCount || "0",
      uploadedAt: item.snippet?.publishedAt,
      description: item.snippet?.description,
      duration: parseDuration(item.contentDetails?.duration || "PT0S"),
      tags: item.snippet?.tags || []
    };
  } catch (error) {
    console.error("❌ Error fetching video details:", error.message);
    return null;
  }
}

// 🔹 4. Fetch Related Videos - SAME PATTERN
export async function fetchRelatedVideos(videoId) {
  if (!API_KEY || !videoId) {
    return { items: [] };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=20&relatedToVideoId=${videoId}&type=video&key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return { items: [] };
    }

    if (!response.ok) {
      // Fallback to popular videos if related videos fail
      return await fetchPopularVideos(20);
    }

    const data = await response.json();
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    if (!videoIds) return { items: [] };
    
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { cache: "no-store" }
    );
    
    const detailsData = await detailsResponse.json();
    
    return {
      items: detailsData.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        channel: item.snippet?.channelTitle,
        views: item.statistics?.viewCount || "0",
        uploadedAt: item.snippet?.publishedAt,
        duration: parseDuration(item.contentDetails?.duration || "PT0S")
      })) || []
    };
  } catch (error) {
    console.error("❌ Error fetching related videos:", error.message);
    // Return popular videos as fallback
    return await fetchPopularVideos(20);
  }
}

// 🔹 6. Search Videos - SAME PATTERN
export async function searchVideos(query, maxResults = 50) {
  if (!API_KEY || !query) return { items: [] };

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&regionCode=IN&key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (response.status === 403) {
      console.error("❌ API Error 403: Forbidden - Check API Key and Quota");
      return { items: [] };
    }

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status}`);
      return { items: [] };
    }

    const data = await response.json();
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    if (!videoIds) return { items: [] };
    
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`,
      { cache: "no-store" }
    );
    
    const detailsData = await detailsResponse.json();
    
    return {
      items: detailsData.items?.map(item => ({
        id: item.id,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        channel: item.snippet?.channelTitle,
        views: item.statistics?.viewCount || "0",
        uploadedAt: item.snippet?.publishedAt,
        duration: parseDuration(item.contentDetails?.duration || "PT0S")
      })) || []
    };
  } catch (error) {
    console.error("❌ Error searching videos:", error.message);
    return { items: [] };
  }
}

// =======================================================
//  EXPORT ALL FUNCTIONS
// =======================================================

export { formatViews, getTimeAgo, parseDuration };
