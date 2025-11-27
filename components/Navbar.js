"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  Bell,
  User,
  MoreVertical,
  LogOut,
  ArrowLeft,
  Menu,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState({ email: "demo@example.com" }); // TEMP USER
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      {/* ================================================================= */}
      {/* ===================== MOBILE SEARCH MODE ====================== */}
      {/* ================================================================= */}

      {isSearchOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-[#272727] flex items-center px-3 z-50">

          {/* Back Arrow */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-full hover:bg-[#272727] active:bg-[#3a3a3a] transition"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>

          {/* SEARCH INPUT + BUTTON */}
          <form onSubmit={handleSearch} className="flex w-full ml-2">

            <div className="flex flex-1 items-center bg-[#121212] rounded-full border border-[#303030] px-4 py-[6px]">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search YouTube"
                className="
                  w-full bg-transparent text-white text-[15px]
                  placeholder-gray-400
                  outline-none border-none focus:ring-0
                "
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="
                ml-2 bg-[#222222] border border-[#303030]
                rounded-full h-10 w-10 flex items-center justify-center
                hover:bg-[#303030] active:bg-[#3a3a3a] transition
              "
            >
              <Search size={18} className="text-white" />
            </button>
          </form>
        </div>
      )}

      {/* ================================================================= */}
      {/* ======================= MAIN NAVBAR =========================== */}
      {/* ================================================================= */}

      {!isSearchOpen && (
        <nav
          className="
          fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f]
          border-b border-[#272727]
          flex items-center justify-between
          px-4 z-40
        "
        >
          {/* -------------------- LEFT SECTION -------------------- */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Hamburger */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-[#272727] transition"
            >
              <Menu size={22} className="text-white" />
            </button>

            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center gap-1 cursor-pointer"
            >
              <img
                src="/youtube.svg"
                alt="YouTube"
                className="h-6 w-auto object-contain"
              />
              <span className="text-[10px] text-gray-400 hidden sm:block mt-1">
                IN
              </span>
            </div>
          </div>

          {/* -------------------- CENTER SEARCH (DESKTOP) -------------------- */}

          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="flex w-full">

              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                flex-1 bg-[#121212] border border-[#303030] rounded-l-full
                px-4 py-2 text-white text-sm 
                outline-none placeholder-gray-400
                focus:border-[#3ea6ff] transition
              "
              />

              <button
                type="submit"
                className="
                bg-[#303030] border border-[#303030] border-l-0
                rounded-r-full px-6 hover:bg-[#404040] transition
              "
              >
                <Search size={20} className="text-white" />
              </button>
            </form>

            {/* Voice Search Button */}
            <button
              type="button"
              className="ml-4 p-3 bg-[#181818] rounded-full hover:bg-[#272727] transition"
            >
              <Mic size={20} className="text-white" />
            </button>
          </div>

          {/* -------------------- RIGHT SECTION -------------------- */}

          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-[#272727]"
            >
              <Search size={20} className="text-white" />
            </button>

            {/* 3 Dot Menu (Desktop) */}
            <button className="hidden md:block p-2 rounded-full hover:bg-[#272727]">
              <MoreVertical size={20} className="text-white" />
            </button>

            {/* Bell */}
            {user && (
              <button className="relative p-2 rounded-full hover:bg-[#272727]">
                <Bell size={20} className="text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
            )}

            {/* Profile / Login */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="
                flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff]
                px-3 py-1.5 rounded-full hover:bg-[#263850]
                text-sm font-medium transition
              "
              >
                <User size={18} /> Sign in
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="
                    w-8 h-8 bg-purple-600 rounded-full 
                    flex items-center justify-center text-white
                    hover:bg-purple-700 transition
                  "
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg p-2 w-48 z-50 shadow-lg">
                    <div className="border-b border-[#333] pb-2 mb-2">
                      <p className="text-white text-sm px-2 py-1 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-red-400 px-2 py-2 hover:bg-[#272727] rounded text-sm"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Push content below navbar */}
      <div className="h-14"></div>
    </>
  );
}
