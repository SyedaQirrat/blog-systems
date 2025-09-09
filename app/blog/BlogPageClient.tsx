"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { PortfolioGrid } from '@/components/portfolio-grid'
import { loadBlogData, BlogData } from "@/lib/data-service"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BlogData>({ posts: [], authors: [], categories: [], series: [] })
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [currentTag, setCurrentTag] = useState<string>("")
  const [currentSeries, setCurrentSeries] = useState<string>("");
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadBlogData()
      .then((blogData: BlogData) => {
        setData(blogData)
        setLoading(false)
        
        const categoryParam = searchParams.get('category');
        const tagParam = searchParams.get('tag');
        if (categoryParam) setCurrentCategory(categoryParam);
        if (tagParam) setCurrentTag(tagParam);
      })
      .catch((error) => {
        console.error("Error loading blog data:", error)
        setLoading(false)
      })
  }, [searchParams])

  const getAuthorName = (authorId: string) => {
    const author = data.authors.find((a) => a.authorId === authorId)
    return author ? author.name : "Unknown Author"
  }

  const getCategoryName = (categoryId: string) => {
    const category = data.categories.find((c) => c.categoryId === categoryId)
    return category ? category.name : "Uncategorized"
  }
  
  const filteredPosts = data.posts
    .filter((post) => {
      if (!post.isPublished) {
        return false;
      }
      
      const query = searchQuery.toLowerCase();
      const postTitleString = post.title?.toLowerCase() ?? '';
      const postTagsString = typeof post.tags === 'string' ? post.tags.toLowerCase() : '';
      const postCategoryString = typeof post.category === 'string' ? post.category.toLowerCase() : '';
      
      const matchesSearch = searchQuery
        ? postTitleString.includes(query) || 
          postTagsString.includes(query)
        : true;

      const matchesCategory = currentCategory ? (postCategoryString === currentCategory.toLowerCase()) : true;
      const matchesTag = currentTag ? postTagsString.split(',').map(tag => tag.trim().toLowerCase()).includes(currentTag.toLowerCase()) : true;
      const matchesSeries = currentSeries ? post.seriesId === currentSeries : true;

      return matchesSearch && matchesCategory && matchesTag && matchesSeries;
    })
    .sort((a, b) => {
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    });
  
  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category)
    setCurrentTag("")
    setSearchQuery("")
    setCurrentSeries("");
  }

  const handleTagClick = (tag: string) => {
    setCurrentTag(tag)
    setCurrentCategory("")
    setSearchQuery("")
    setCurrentSeries("");
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentCategory("");
    setCurrentTag("");
    setCurrentSeries("");
  }

  const clearFilters = () => {
    setCurrentCategory("")
    setCurrentTag("")
    setSearchQuery("")
    setCurrentSeries("");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        categories={data.categories}
        currentCategory={currentCategory}
        currentTag={currentTag}
        onCategoryClick={handleCategoryClick}
        onClearFilters={clearFilters}
      />
      
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="flex justify-end mb-4">
          {(currentCategory || currentTag) && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {currentCategory ? `Category: ${currentCategory}` : `Tag: ${currentTag}`}
              </span>
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 underline">
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Combined Filter and Search Container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="w-full sm:w-auto sm:flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-full text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[240px]">
            <Label htmlFor="series-filter" className="sr-only">Filter by series</Label>
            <Select
              onValueChange={(value) => {
                setCurrentSeries(value);
                setCurrentCategory("");
                setCurrentTag("");
                setSearchQuery("");
              }}
              value={currentSeries}
            >
              <SelectTrigger id="series-filter">
                <SelectValue placeholder="Filter by Series" />
              </SelectTrigger>
              <SelectContent>
                {data.series.map((series) => (
                  <SelectItem key={series._id} value={series._id}>
                    {series.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {currentCategory || currentTag || currentSeries || searchQuery ? "No posts found for this filter." : "No posts available."}
            </div>
          </div>
        ) : (
          <PortfolioGrid
              filteredPosts={filteredPosts}
              authors={data.authors}
              categories={data.categories}
              getAuthorName={getAuthorName}
              getCategoryName={getCategoryName}
              onCategoryClick={handleCategoryClick}
              onTagClick={handleTagClick}
            />
        )}
      </section>
    </main>
  )
}