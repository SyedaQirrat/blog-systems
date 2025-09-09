"use client"

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { loadBlogData, getBlogsBySeries, Post, Series, Category, Author } from "@/lib/data-service";

export default function SeriesPage({ params }: { params: { id: string } }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData = await loadBlogData();
        const seriesData = allData.series.find(s => s._id === params.id);
        const postsData = await getBlogsBySeries(params.id);

        setSeries(seriesData || null);
        setPosts(postsData);
        setAuthors(allData.authors);
        setCategories(allData.categories);
      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const getAuthorName = (authorId: string) => {
    const author = authors.find((a) => a.authorId === authorId);
    return author ? author.name : "Unknown Author";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (loading) {
    return <div className="text-center py-24">Loading series...</div>;
  }

  if (!series) {
    return <div className="text-center py-24">Series not found.</div>;
  }

  return (
    <>
      <Navbar
        categories={categories}
        currentCategory=""
        currentTag=""
        onCategoryClick={() => {}}
        onClearFilters={() => {}}
      />
      <main className="container mx-auto px-4 py-12">
        <section>
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">{series.title}</h1>
            <p className="mt-2 text-lg text-gray-600">{series.description}</p>
          </div>
          
          <PortfolioGrid
            filteredPosts={posts}
            authors={authors}
            categories={categories}
            getAuthorName={getAuthorName}
            getCategoryName={getCategoryName}
            onCategoryClick={() => {}}
            onTagClick={() => {}}
          />
        </section>
      </main>
    </>
  );
}