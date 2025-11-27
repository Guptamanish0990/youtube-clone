"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Github, Linkedin, Globe } from "lucide-react";

import {
  Home, SquarePlay, MonitorPlay, User, History,
  ShoppingBag, Music2, Clapperboard, Radio,
  Gamepad2, Newspaper, Trophy, GraduationCap,
  Shirt, Mic2, Settings, Flag, HelpCircle, MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMini, setIsMini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  const mobileRef = useRef(false);

  // Load user data
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  // Detect screen size
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setIsMobile(true);
        setIsMini(false);
      } else if (w < 1280) {
        setIsMobile(false);
        setIsMini(true);
      } else {
        setIsMobile(false);
        setIsMini(false);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    mobileRef.current = isMobile;
  }, [isMobile]);

  // Sidebar toggle from Navbar
  useEffect(() => {
    const toggleDrawer = () => {
      if (mobileRef.current) setDrawerOpen((prev) => !prev);
    };

    window.addEventListener("toggle-sidebar", toggleDrawer);
    return () => window.removeEventListener("toggle-sidebar", toggleDrawer);
  }, []);

  const MenuItem = ({ icon: Icon, label, path }) => {
    const isActive = pathname === path;

    return (
      <div
        onClick={() => {
          router.push(path);
          if (mobileRef.current) setDrawerOpen(false);
        }}
        className={`
          flex items-center gap-4 px-3 sm:px-4 py-2.5 cursor-pointer rounded-lg transition
          hover:bg-[#272727] active:bg-[#3f3f3f]
          ${isActive ? "bg-[#272727] font-medium" : ""}
          ${isMini ? "justify-center" : ""}
        `}
      >
        <Icon size={20} />
        {!isMini && <span className="text-sm">{label}</span>}
      </div>
    );
  };

  const sidebarWidth = isMobile
    ? drawerOpen ? "w-60" : "w-0"
    : isMini ? "w-16 sm:w-20" : "w-60";

  if (!mounted)
    return (
      <aside className="fixed top-14 left-0 h-[calc(100vh-56px)]
        w-60 bg-[#0f0f0f] border-r border-[#272727]" />
    );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-56px)] bg-[#0f0f0f]
          text-white border-r border-[#272727] overflow-y-auto
          transition-all duration-300 z-50 ${sidebarWidth}
        `}
      >
        {/* MAIN */}
        <div className="border-b border-[#272727] py-2 sm:py-3">
          <MenuItem icon={Home} path="/" label="Home" />
          <MenuItem icon={SquarePlay} path="/shorts" label="Shorts" />
          <MenuItem icon={MonitorPlay} path="/subscriptions" label="Subscriptions" />
        </div>

        {/* YOU SECTION */}
        <div className="py-2 sm:py-3">
          {!isMini && (
            <p className="px-4 pb-2 text-xs text-gray-400 font-semibold">You</p>
          )}
          <MenuItem icon={User} path="/channel" label="Your Channel" />
          <MenuItem icon={History} path="/history" label="History" />
        </div>

        {/* SIGN-IN (ONLY IF USER NOT LOGGED IN) */}
        {!isMini && !user && (
          <div className="px-4 py-4 border-t border-b border-[#272727]">
            <p className="text-xs text-gray-300 mb-3">
              Sign in to like videos, comment and subscribe.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="border border-[#3ea6ff] text-[#3ea6ff]
              px-3 py-1.5 text-xs rounded-full hover:bg-[#263850] flex items-center gap-2"
            >
              <User size={18} /> Sign in
            </button>
          </div>
        )}

        {/* EXPLORE */}
        <div className="py-2 sm:py-3">
          {!isMini && (
            <p className="px-4 pb-2 text-xs text-gray-400 font-semibold">
              Explore
            </p>
          )}

          <MenuItem icon={ShoppingBag} label="Shopping" path="/shopping" />
          <MenuItem icon={Music2} label="Music" path="/music" />
          <MenuItem icon={Clapperboard} label="Films" path="/films" />
          <MenuItem icon={Radio} label="Live" path="/live" />
          <MenuItem icon={Gamepad2} label="Gaming" path="/gaming" />
          <MenuItem icon={Newspaper} label="News" path="/news" />
          <MenuItem icon={Trophy} label="Sport" path="/sport" />
          <MenuItem icon={GraduationCap} label="Courses" path="/courses" />
          <MenuItem icon={Shirt} label="Fashion & beauty" path="/fashion" />
          <MenuItem icon={Mic2} label="Podcasts" path="/podcasts" />
        </div>

        {/* MORE FROM YOUTUBE */}
        {!isMini && (
          <div className="py-2 pt-4 border-t border-[#272727]">
            <p className="px-4 pb-2 text-xs text-gray-400 font-semibold">
              More from YouTube
            </p>

            <div className="space-y-1">
              <div className="flex items-center gap-4 px-4 py-2.5 hover:bg-[#272727] rounded-lg cursor-pointer">
                <div className="text-red-500"><Clapperboard size={20} /></div>
                <span>YouTube Premium</span>
              </div>

              <div className="flex items-center gap-4 px-4 py-2.5 hover:bg-[#272727] rounded-lg cursor-pointer">
                <div className="text-red-500"><Music2 size={20} /></div>
                <span>YouTube Music</span>
              </div>

              <div className="flex items-center gap-4 px-4 py-2.5 hover:bg-[#272727] rounded-lg cursor-pointer">
                <div className="text-red-500"><User size={20} /></div>
                <span>YouTube Kids</span>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS & HELP */}
        <div className="py-2 border-t border-[#272727]">
          <MenuItem icon={Settings} label="Settings" path="/settings" />
          <MenuItem icon={Flag} label="Report history" path="/report-history" />
          <MenuItem icon={HelpCircle} label="Help" path="/help" />
          <MenuItem icon={MessageSquare} label="Send feedback" path="/feedback" />
        </div>

        {/* FOOTER WITH SOCIAL LINKS */}
        {!isMini && (
          <div className="px-4 py-6 border-t border-[#272727] space-y-3 pb-20 text-gray-500">
            {/* LINKS */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Press</a>
              <a href="#" className="hover:text-white">Copyright</a>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <a href="#" className="hover:text-white">Contact us</a>
              <a href="#" className="hover:text-white">Creator</a>
              <a href="#" className="hover:text-white">Advertise</a>
            </div>

            <div className="space-y-1 text-[11px]">
              <a href="#" className="hover:text-white block">Terms</a>
              <a href="#" className="hover:text-white block">Privacy</a>
              <a href="#" className="hover:text-white block">Policy & Safety</a>
            </div>

            {/* SOCIAL ICONS */}
            <div className="pt-3 border-t border-[#272727] space-y-2">
              <p className="font-semibold text-gray-400 text-xs">Connect</p>

              <div className="flex gap-4">

                {/* GitHub */}
                <a
                  href="https://github.com/Guptamanish0990"
                  target="_blank"
                  className="group relative flex items-center justify-center"
                >
                  <Github size={20} className="text-gray-300 group-hover:text-white" />

                  <span
                    className="absolute bottom-7 bg-black text-white text-[10px] px-2 py-1 
                    rounded opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition-all duration-200 whitespace-nowrap"
                  >
                    GitHub
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/manish-gupta-0990"
                  target="_blank"
                  className="group relative flex items-center justify-center"
                >
                  <Linkedin size={20} className="text-blue-400 group-hover:text-blue-300" />

                  <span
                    className="absolute bottom-7 bg-black text-white text-[10px] px-2 py-1 
                    rounded opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition-all duration-200 whitespace-nowrap"
                  >
                    LinkedIn
                  </span>
                </a>

                {/* Portfolio */}
                <a
                  href="https://guptamanish0990.github.io/Manish_Gupta/#/"
                  target="_blank"
                  className="group relative flex items-center justify-center"
                >
                  <Globe size={20} className="text-green-300 group-hover:text-green-200" />

                  <span
                    className="absolute bottom-7 bg-black text-white text-[10px] px-2 py-1 
                    rounded opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition-all duration-200 whitespace-nowrap"
                  >
                    Portfolio
                  </span>
                </a>

              </div>
            </div>

            {/* COPYRIGHT */}
            <div className="text-gray-500">© 2025 Google LLC</div>

            <div className="text-center text-[11px] text-gray-500">
              Built by <span className="text-white font-semibold">Manish Gupta</span> •
              <a
                href="https://github.com/Guptamanish0990"
                target="_blank"
                className="text-green-400 hover:text-green-300 ml-1"
              >
                GitHub Repo
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
