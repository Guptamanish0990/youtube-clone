// ====================== app/layout.js ======================
"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideLayout = pathname === "/login" || pathname === "/signup";

  const [sidebarMargin, setSidebarMargin] = useState("ml-60");

  useEffect(() => {
    if (hideLayout) return;

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setSidebarMargin("ml-0");
      else if (w < 1280) setSidebarMargin("ml-16 sm:ml-20");
      else setSidebarMargin("ml-60");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hideLayout]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#0f0f0f] text-white overflow-x-hidden"
      >
        {!hideLayout && <Navbar />}
        {!hideLayout && <Sidebar />}

        <main
          className={`transition-all ${
            hideLayout ? "" : `pt-14 ${sidebarMargin}`
          }`}
        >
          {children}
        </main>

      </body>
    </html>
  );
}
