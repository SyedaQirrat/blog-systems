"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export default function PostDetail({ params }: { params: { id: string } }) {
  const [data, setData] = useState<BlogData | null>(null)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadBlogData().then(setData)
  }, [])

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  const post = data.posts.find((p) => p.id.toString() === params.id)
  const author = data.authors.find((a) => a.authorId === post?.authorId)
  const category = data.categories.find((c) => c.categoryId === post?.categoryId)

  const handleImageError = () => {
    setImageError(true)
  }

  const getFallbackImage = () => {
    if (!post) return ""
    const colors = ["f97316", "fbbf24", "10b981", "3b82f6", "8b5cf6", "ec4899"]
    const color = colors[post.id % colors.length]
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodeURIComponent(post.title)}`
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/?category=${categoryId}`)
  }

  const handleTagClick = (tag: string) => {
    router.push(`/?tag=${tag}`)
  }

  if (!post) return <div className="min-h-screen bg-white flex items-center justify-center">Post not found</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#aab8f7" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-white hover:text-blue-200 transition-colors mb-6">
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-6xl font-thin mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-100">
            <span>by {author?.name}</span>
            <span>•</span>
            <button
              onClick={() => handleCategoryClick(post.categoryId)}
              className="text-white hover:text-blue-200 transition-colors underline"
            >
              {category?.name}
            </button>
            <span>•</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Post Image */}
        {post.image && (
          <div className="mb-12">
            <img
              src={imageError ? getFallbackImage() : post.image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-full text-sm transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/manage-post/${post.id}`}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: "#aab8f7" }}
          >
            Edit Post
          </Link>
        </div>
      </div>
    </div>
  )
}
