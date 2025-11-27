"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchShorts, fetchVideoDetails } from "@/lib/youtube";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export default function ShortsViewer({ params }) {
  const router = useRouter();
  const { id } = params;

  const [shorts, setShorts] = useState([]);
  const [index, setIndex] = useState(-1);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD SHORTS + FIND CURRENT VIDEO INDEX
  useEffect(() => {
    const loadAll = async () => {
      const data = await fetchShorts(50);
      setShorts(data.items);

      const i = data.items.findIndex((s) => s.id === id);
      setIndex(i !== -1 ? i : 0);

      const v = await fetchVideoDetails(id);
      setVideo(v);
      setLoading(false);
    };
    loadAll();
  }, [id]);

  // NAVIGATION LOGIC
  const nextShort = () => {
    if (index < shorts.length - 1) {
      router.push(`/shorts/watch/${shorts[index + 1].id}`);
    }
  };

  const prevShort = () => {
    if (index > 0) {
      router.push(`/shorts/watch/${shorts[index - 1].id}`);
    }
  };

  if (loading || !video) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        Loading Shorts...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex justify-center items-center overflow-hidden">

      {/* MAIN VIDEO */}
      <div className="relative h-full max-w-[480px] w-full flex items-center justify-center">
        <iframe
          className="w-full h-full object-cover"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0`}
          allowFullScreen
        ></iframe>
      </div>

      {/* ACTION BUTTONS (RIGHT SIDE) */}
      <div className="absolute right-3 bottom-28 flex flex-col gap-5 text-white md:right-5 md:bottom-40">

        {/* LIKE */}
        <button className="flex flex-col items-center">
          <div className="bg-black/50 backdrop-blur p-3 rounded-full">
            <ThumbsUp size={24} />
          </div>
          <span className="text-xs mt-1">{video.likes || 0}</span>
        </button>

        {/* DISLIKE */}
        <button className="flex flex-col items-center">
          <div className="bg-black/50 backdrop-blur p-3 rounded-full">
            <ThumbsDown size={24} />
          </div>
          <span className="text-xs mt-1">Dislike</span>
        </button>

        {/* MORE */}
        <button className="bg-black/50 p-3 rounded-full">
          <MoreVertical size={24} />
        </button>

        {/* SHARE */}
        <button className="bg-black/50 p-3 rounded-full">
          <Share2 size={24} />
        </button>
      </div>

      {/* MOBILE-FRIENDLY UP/DOWN NAVIGATION BUTTONS */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 md:bottom-[45%] flex flex-col items-center gap-5 z-50">

        {/* PREVIOUS SHORT */}
        {index > 0 && (
          <button
            onClick={prevShort}
            className="bg-black/40 backdrop-blur p-2 md:p-3 rounded-full hover:bg-black/70 transition"
          >
            <ArrowUpCircle size={38} className="text-white" />
          </button>
        )}

        {/* NEXT SHORT */}
        {index < shorts.length - 1 && (
          <button
            onClick={nextShort}
            className="bg-black/40 backdrop-blur p-2 md:p-3 rounded-full hover:bg-black/70 transition"
          >
            <ArrowDownCircle size={38} className="text-white" />
          </button>
        )}
      </div>

      {/* CAPTION / BOTTOM INFO */}
      <div className="absolute bottom-3 left-4 right-4 text-white">
        <p className="text-[15px] font-semibold">{video.title}</p>
        {video.tags && (
          <p className="text-xs text-gray-300 mt-1">
            #{video.tags.slice(0, 3).join(" #")}
          </p>
        )}
      </div>
    </div>
  );
}
