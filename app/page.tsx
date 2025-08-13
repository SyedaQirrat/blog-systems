"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import PostCard from '@/components/post-card'
import { PortfolioGrid } from '@/components/portfolio-grid'

interface Post {
  id: number
  title: string
  content: string
  image: string
  authorId: string
  categoryId: string
  tags: string[]
  isPublished?: boolean
  publishedDate?: string
}

interface Author {
  authorId: string
  name: string
}

interface Category {
  categoryId: string
  name: string
}

interface BlogData {
  posts: Post[]
  authors: Author[]
  categories: Category[]
}

const loadBlogData = async (): Promise<BlogData> => {
  // Try to load from localStorage first
  const storedData = localStorage.getItem("blogData")
  if (storedData) {
    return JSON.parse(storedData)
  }

  // Fallback to data.json
  const response = await fetch("/data.json")
  const data = await response.json()

  // Store in localStorage for future use
  localStorage.setItem("blogData", JSON.stringify(data))
  return data
}

export default function BlogPage() {
  const [data, setData] = useState<BlogData>({ posts: [], authors: [], categories: [] })
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [currentTag, setCurrentTag] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showDrafts, setShowDrafts] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadBlogData()
      .then((blogData: BlogData) => {
        setData(blogData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading blog data:", error)
        setLoading(false)
      })
  }, [])

  const getAuthorName = (authorId: string) => {
    const author = data.authors.find((a) => a.authorId === authorId)
    return author ? author.name : "Unknown Author"
  }

  const getCategoryName = (categoryId: string) => {
    const category = data.categories.find((c) => c.categoryId === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const filteredPosts = data.posts.filter((post) => {
    // Filter by publish status
    if (!showDrafts && !post.isPublished) {
      return false
    }
    
    // Filter by search query on title, tags, and category
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        getCategoryName(post.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch) {
        return false;
    }

    // Filter by category
    if (currentCategory) {
      return post.categoryId === currentCategory
    }
    // Filter by tag
    if (currentTag) {
      return post.tags.includes(currentTag)
    }
    
    return true
  })

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategory(categoryId)
    setCurrentTag("")
    setSearchQuery("")
  }

  const handleTagClick = (tag: string) => {
    setCurrentTag(tag)
    setCurrentCategory("")
    setSearchQuery("")
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentCategory("");
    setCurrentTag("");
  }

  const clearFilters = () => {
    setCurrentCategory("")
    setCurrentTag("")
    setSearchQuery("")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        categories={data.categories}
        currentCategory={currentCategory}
        currentTag={currentTag}
        onCategoryClick={handleCategoryClick}
        onClearFilters={clearFilters}
      />
      
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-8">
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {/* Show Drafts Toggle */}
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    id="showDrafts"
                    checked={showDrafts}
                    onChange={(e) => setShowDrafts(e.target.checked)}
                    />
                    <label htmlFor="showDrafts" className="text-sm text-gray-600">
                    Show Drafts
                    </label>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full md:max-w-md mx-auto px-4 py-2 text-sm rounded-full text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {currentCategory || currentTag || searchQuery ? "No posts found for this filter." : "No posts available."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                getAuthorName={getAuthorName}
                getCategoryName={getCategoryName}
                onCategoryClick={handleCategoryClick}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}