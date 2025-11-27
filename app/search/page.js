"use client";

import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
