import { Suspense } from 'react';
import BlogPageClient from './blogPageClient'; // Ensure this matches the new filename exactly

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <BlogPageClient />
    </Suspense>
  );
}