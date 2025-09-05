import { Suspense } from 'react';
import BlogPageClient from './blogPageClient'; // Corrected from 'BlogPageClient' to 'blogPageClient'

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <BlogPageClient />
    </Suspense>
  );
}