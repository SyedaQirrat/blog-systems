import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient';

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageClient />
    </Suspense>
  );
}