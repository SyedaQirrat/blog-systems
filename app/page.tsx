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
    if (currentCategory) {
      return post.categoryId === currentCategory
    }
    if (currentTag) {
      return post.tags.includes(currentTag)
    }
    return true
  })

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategory(categoryId)
    setCurrentTag("")
  }

  const handleTagClick = (tag: string) => {
    setCurrentTag(tag)
    setCurrentCategory("")
  }

  const clearFilters = () => {
    setCurrentCategory("")
    setCurrentTag("")
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
        {/* Active filter indicator */}
        {(currentCategory || currentTag) && (
          <div className="mb-8 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentCategory ? `Category: ${getCategoryName(currentCategory)}` : `Tag: ${currentTag}`}
            </span>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 underline">
              Clear filter
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {currentCategory || currentTag ? "No posts found for this filter." : "No posts available."}
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