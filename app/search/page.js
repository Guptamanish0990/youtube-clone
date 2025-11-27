import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading search...</div>}>
      <SearchClient />
    </Suspense>
  );
}