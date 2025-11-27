"use client";

import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";       // ⬅ PREVENT SSR
export const revalidate = 0;                 // ⬅ PREVENT SSG
export const dynamicParams = true;           // ⬅ PREVENT PRERENDERING ERRORS

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
