"use client"

import { useState } from "react"
import PostCard from "../components/post-card"
import { PortfolioGrid } from "../components/portfolio-grid"

// Sample data
const samplePosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    content:
      "Next.js is a powerful React framework that makes building web applications easier. It provides features like server-side rendering, static site generation, and API routes out of the box. In this comprehensive guide, we'll explore how to get started with Next.js and build your first application.",
    image: "/nextjs-development.png",
    authorId: "1",
    categoryId: "1",
    tags: ["nextjs", "react", "web-development"],
  },
  {
    id: 2,
    title: "Modern CSS Techniques",
    content:
      "CSS has evolved significantly over the years. Modern CSS techniques like Grid, Flexbox, and CSS Variables have revolutionized how we style web pages. Learn about the latest CSS features and how to implement them in your projects for better design and maintainability.",
    image: "/css-grid-layout.png",
    authorId: "2",
    categoryId: "2",
    tags: ["css", "design", "frontend"],
  },
  {
    id: 3,
    title: "JavaScript Best Practices",
    content:
      "Writing clean, maintainable JavaScript code is crucial for any web developer. This article covers essential JavaScript best practices, including proper variable naming, function organization, error handling, and performance optimization techniques.",
    image: "/javascript-code.png",
    authorId: "1",
    categoryId: "1",
    tags: ["javascript", "best-practices", "coding"],
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    content:
      "Great user interface and user experience design can make or break an application. Understanding fundamental design principles like hierarchy, contrast, alignment, and user flow is essential for creating intuitive and engaging digital experiences.",
    image: "/ui-ux-design-concept.png",
    authorId: "3",
    categoryId: "3",
    tags: ["design", "ui", "ux", "principles"],
  },
]

const authors = [
  { authorId: "1", name: "John Doe" },
  { authorId: "2", name: "Jane Smith" },
  { authorId: "3", name: "Mike Johnson" },
]

const categories = [
  { categoryId: "1", name: "Development" },
  { categoryId: "2", name: "Design" },
  { categoryId: "3", name: "User Experience" },
]

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const getAuthorName = (authorId: string) => {
    return authors.find((author) => author.authorId === authorId)?.name || "Unknown Author"
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((category) => category.categoryId === categoryId)?.name || "Unknown Category"
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    setSelectedTag(null)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag)
    setSelectedCategory(null)
  }

  const filteredPosts = samplePosts.filter((post) => {
    if (selectedCategory && post.categoryId !== selectedCategory) return false
    if (selectedTag && !post.tags.includes(selectedTag)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-4xl font-bold text-black text-center">Blog Cards with Black Text</h1>
          <p className="text-lg text-black text-center mt-2">
            Showcasing blog cards with consistent black text styling
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-black font-medium">Filters:</span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1 bg-blue-100 text-black rounded-full text-sm"
              >
                Category: {getCategoryName(selectedCategory)} ✕
              </button>
            )}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1 bg-green-100 text-black rounded-full text-sm"
              >
                Tag: {selectedTag} ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PostCard Layout */}
      <section className="py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-8">Masonry Layout (PostCard Component)</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
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
        </div>
      </section>

      {/* PortfolioGrid Layout */}
      <PortfolioGrid
        filteredPosts={filteredPosts}
        authors={authors}
        categories={categories}
        getAuthorName={getAuthorName}
        getCategoryName={getCategoryName}
        onCategoryClick={handleCategoryClick}
        onTagClick={handleTagClick}
      />
    </div>
  )
}
