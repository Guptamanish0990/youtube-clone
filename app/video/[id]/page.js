// ==================== app/video/[id]/page.js ====================
"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { fetchVideoDetails, fetchRelatedVideos, fetchShorts, formatViews, getTimeAgo } from "@/lib/youtube";
import Link from "next/link";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreVertical,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isShort, setIsShort] = useState(false);

  // ==================== LOAD VIDEO ====================
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoData = await fetchVideoDetails(id);
        setVideo(videoData);
        setLikeCount(parseInt(videoData?.likes || 0));

        // Fix: Declare totalSeconds outside
        let totalSeconds = 0;

        const durationMatch = videoData?.duration?.match(/^(\d+):(\d+)$/);
        if (durationMatch) {
          const [_, minutes, seconds] = durationMatch;
          totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
          setIsShort(totalSeconds <= 60);
        }

        // Load Shorts or Related Videos
        if (totalSeconds <= 60) {
          const shorts = await fetchShorts();
          setRelatedVideos(shorts.items || []);
        } else {
          const related = await fetchRelatedVideos(id);
          setRelatedVideos(related.items || []);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  // ==================== LIKE / DISLIKE HANDLERS ====================
  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
      setDisliked(false);
    } else {
      setLikeCount(likeCount - 1);
      setLiked(false);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDisliked(true);
      setLiked(false);
    } else {
      setDisliked(false);
    }
  };

  // ==================== LOADING UI ====================
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">❌ Video not found</p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // ====================== SHORTS UI =====================
  // =====================================================
  if (isShort) {
    return (
      <div className="fixed inset-0 bg-black text-white overflow-hidden">
        <div className="flex h-full">
          {/* Main Shorts Player */}
          <div className="flex-1 relative flex items-center justify-center">
            <div className="relative w-full h-full max-w-[500px] mx-auto">

              {/* Video Player */}
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0&modestbranding=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-cover"
              ></iframe>

              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="text-sm font-medium">Shorts</div>
                <button className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Bottom Overlay - Title, Channel */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {video.channel?.charAt(0) || "Y"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{video.channel}</p>
                    <p className="text-xs text-gray-400">{formatViews(video.views)} views</p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Subscribe
                  </button>
                </div>

                <p className="text-sm line-clamp-2 mb-1">{video.title}</p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-400">
                  {video.tags?.slice(0, 3).map((tag, i) => (
                    <span key={i}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE ACTION BUTTONS */}
              <div className="absolute right-3 bottom-32 flex flex-col gap-5 z-20">
                {/* Like */}
                <button onClick={handleLike} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                      liked ? "bg-white text-black" : "bg-black/30"
                    }`}
                  >
                    <ThumbsUp size={24} className={liked ? "fill-current" : ""} />
                  </div>
                  <span className="text-xs font-medium">{formatViews(likeCount)}</span>
                </button>

                {/* Dislike */}
                <button onClick={handleDislike} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                      disliked ? "bg-white text-black" : "bg-black/30"
                    }`}
                  >
                    <ThumbsDown size={24} className={disliked ? "fill-current" : ""} />
                  </div>
                  <span className="text-xs font-medium">Dislike</span>
                </button>

                {/* Comments */}
                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-xs font-medium">123</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
                    <Share2 size={24} />
                  </div>
                  <span className="text-xs font-medium">Share</span>
                </button>
              </div>

              {/* ======================================================= */}
              {/* SHORTS UP / DOWN NAVIGATION  (YOU REQUESTED THIS)      */}
              {/* ======================================================= */}
              <div className="absolute left-3 bottom-32 flex flex-col gap-5 z-20">
                
                {/* Previous Short (Up button) */}
                <button
                  onClick={() => {
                    const index = relatedVideos.findIndex((v) => v.id === id);
                    if (index > 0) {
                      router.push(`/video/${relatedVideos[index - 1].id}`);
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center"
                >
                  <ArrowLeft size={22} className="rotate-90" />
                </button>

                {/* Next Short (Down button) */}
                <button
                  onClick={() => {
                    const index = relatedVideos.findIndex((v) => v.id === id);
                    if (index < relatedVideos.length - 1) {
                      router.push(`/video/${relatedVideos[index + 1].id}`);
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center"
                >
                  <ArrowLeft size={22} className="-rotate-90" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Sidebar - More Shorts */}
          <div className="hidden lg:block w-[420px] bg-black border-l border-[#272727] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">More Shorts</h2>

              <div className="grid grid-cols-2 gap-2">
                {relatedVideos.map((short) => (
                  <Link key={short.id} href={`/video/${short.id}`} className="group cursor-pointer">
                    <div className="relative bg-[#272727] rounded-lg overflow-hidden aspect-[9/16] mb-2">
                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute bottom-2 left-2 text-xs font-bold">
                        {formatViews(short.views)}
                      </div>
                    </div>
                    <h3 className="text-xs font-medium line-clamp-2 px-1">{short.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ==================== REGULAR VIDEO UI =================
  // =====================================================
  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-[1920px] mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* LEFT: Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden mb-4">
              <div className="relative aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold mb-4">{video.title}</h1>

            {/* Channel & Actions */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#272727]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {video.channel?.charAt(0) || "Y"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{video.channel}</p>
                  <p className="text-xs text-gray-400">
                    {formatViews(video.views)} views • {getTimeAgo(video.uploadedAt)}
                  </p>
                </div>

                <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm ml-4">
                  Subscribe
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-l-full ${
                    liked ? "bg-white text-black" : "bg-[#272727]"
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span>{formatViews(likeCount)}</span>
                </button>

                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 rounded-r-full border-l border-[#404040] ${
                    disliked ? "bg-white text-black" : "bg-[#272727]"
                  }`}
                >
                  <ThumbsDown size={18} />
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#272727] rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold">{formatViews(video.views)} views</span>
                <span className="mx-2">•</span>
                {getTimeAgo(video.uploadedAt)}
              </p>

              <div className={`text-sm text-gray-300 whitespace-pre-wrap ${showFullDescription ? "" : "line-clamp-3"}`}>
                {video.description || "No description available"}
              </div>

              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm font-medium mt-2"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">Comments</h2>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#272727] rounded-full"></div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent border-b border-[#272727] pb-2 text-sm outline-none focus:border-white"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Related Videos */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold mb-4">Related videos</h2>

            <div className="space-y-3">
              {relatedVideos.map((relVideo) => (
                <Link
                  key={relVideo.id}
                  href={`/video/${relVideo.id}`}
                  className="flex gap-3 hover:bg-[#272727] rounded-lg p-2"
                >
                  <div className="relative bg-[#272727] rounded-lg overflow-hidden w-40 h-24 flex-shrink-0">
                    <img
                      src={relVideo.thumbnail}
                      alt={relVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/90 px-1 py-0.5 rounded text-xs font-bold">
                      {relVideo.duration}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">{relVideo.title}</h3>
                    <p className="text-xs text-gray-400">{relVideo.channel}</p>
                    <p className="text-xs text-gray-500">{formatViews(relVideo.views)} views</p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
