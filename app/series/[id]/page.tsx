"use client"

import { useState, useEffect } from 'react';
import { Post, Series, loadBlogData } from '@/lib/data-service';
import PostCard from '@/components/post-card';
import { useRouter } from 'next/navigation';

export default function SeriesPage({ params }: { params: { id: string } }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      try {
        // Fetch all blog data (posts, categories, series)
        const allData = await loadBlogData(1, 100); // Fetch a large number to get all posts

        // Find the specific series by its ID from the URL params
        const currentSeries = allData.series.find(s => s._id === params.id);
        setSeries(currentSeries || null);

        // Filter the posts to find only those that belong to this series
        const seriesPosts = allData.posts.filter(p => p.seriesId === params.id);
        setPosts(seriesPosts);

      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-10">Loading series...</div>;
  }

  if (!series) {
    return <div className="text-center py-10">Series not found.</div>;
  }
  
  // Dummy functions required by PostCard, can be customized later
  const getAuthorName = () => "Admin";
  const getCategoryName = (category: string) => category;
  const handleCategoryClick = (category: string) => router.push(`/blog?category=${category}`);
  const handleTagClick = (tag: string) => router.push(`/blog?tag=${tag}`);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#0E4772" }}>
            {series.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {series.description}
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                getAuthorName={getAuthorName}
                getCategoryName={getCategoryName}
                onCategoryClick={handleCategoryClick}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts found in this series yet.</p>
        )}
      </div>
    </div>
  );
}