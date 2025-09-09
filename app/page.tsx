"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadBlogData, BlogData, Post, Series } from "@/lib/data-service";
import PostCard from "@/components/post-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const SeriesCard = ({ series }: { series: Series }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group p-4 border border-gray-200 h-full flex flex-col">
    <h3 className="text-lg font-bold text-black mb-2">{series.title}</h3>
    <p className="text-sm text-gray-600 flex-grow">{series.description}</p>
  </div>
);

export default function LandingPage() {
  const [data, setData] = useState<BlogData>({ posts: [], authors: [], categories: [], series: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBlogData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/blog?category=${category}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/blog?tag=${tag}`);
  };
  
  const clearFilters = () => {
    router.push('/blog');
  }

  const getAuthorName = (authorId: string) => data.authors.find(a => a.authorId === authorId)?.name || 'Unknown';
  const getCategoryName = (categoryId: string) => data.categories.find(c => c.categoryId === categoryId)?.name || 'Uncategorized';

  const publishedPosts = data.posts.filter(post => post.isPublished);

  const latestPosts = publishedPosts.slice(0, 10);
  const technologyPosts = publishedPosts.filter(p => p.category === 'tech').slice(0, 8);
  const productivityPosts = publishedPosts.filter(p => p.category === 'productivity').slice(0, 8);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <>
       <Navbar 
        categories={data.categories}
        currentCategory=""
        currentTag=""
        onCategoryClick={handleCategoryClick}
        onClearFilters={clearFilters}
      />
      <main className="bg-gray-50">
        <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16">
          {/* Section 1: All Series */}
            <div style={{ backgroundColor: '#7ACB59' }} className="rounded-lg mb-12 overflow-hidden">
            {/* Blue line at the top */}
            <div className="h-1 w-full" style={{ backgroundColor: '#0E4772' }} />
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">All Series</h2>
                <Button asChild variant="link">
                  <Link href="/blog">View All</Link>
                </Button>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent>
                  {data.series.slice(0, 8).map((series) => (
                    <CarouselItem key={series._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1 h-full">
                        <SeriesCard series={series} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* Section 2: Latest Blog Posts */}
            <div className="rounded-lg mb-12 overflow-hidden">
            {/* Blue line at the top */}
            <div className="h-1 w-full" style={{ backgroundColor: '#0E4772' }} />
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">Latest Blogs</h2>
                <Button asChild variant="link">
                  <Link href="/blog">View All</Link>
                </Button>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent>
                  {latestPosts.map(post => (
                    <CarouselItem key={post._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1 h-full">
                        <PostCard post={post} getAuthorName={getAuthorName} getCategoryName={getCategoryName} onCategoryClick={handleCategoryClick} onTagClick={handleTagClick} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* Section 3: Featured Category - Technology */}
            <div className="rounded-lg mb-12 overflow-hidden">
               {/* Blue line at the top */}
            <div className="h-1 w-full" style={{ backgroundColor: '#0E4772' }} />
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">Technology</h2>
                <Button asChild variant="link">
                  <Link href="/blog?category=Technology">View All</Link>
                </Button>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent>
                  {technologyPosts.map(post => (
                    <CarouselItem key={post._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1 h-full">
                        <PostCard post={post} getAuthorName={getAuthorName} getCategoryName={getCategoryName} onCategoryClick={handleCategoryClick} onTagClick={handleTagClick} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* Section 4: Featured Category - Productivity */}
            <div className="rounded-lg mb-12 overflow-hidden">
               {/* Blue line at the top */}
            <div className="h-1 w-full" style={{ backgroundColor: '#0E4772' }} />
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">Productivity</h2>
                <Button asChild variant="link">
                  <Link href="/blog?category=Productivity">View All</Link>
                </Button>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent>
                  {productivityPosts.map(post => (
                    <CarouselItem key={post._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1 h-full">
                        <PostCard post={post} getAuthorName={getAuthorName} getCategoryName={getCategoryName} onCategoryClick={handleCategoryClick} onTagClick={handleTagClick} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}