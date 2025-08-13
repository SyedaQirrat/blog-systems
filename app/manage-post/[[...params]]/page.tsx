"use client"

import type React from "react"

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

const saveBlogData = (data: BlogData) => {
  localStorage.setItem("blogData", JSON.stringify(data))
}

export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter()
  const postId = params?.params?.[0]
  const isEditing = !!postId && postId !== 'all' && postId !== 'new'
  const isCreating = postId === 'new'

  const [data, setData] = useState<BlogData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    authorId: "",
    categoryId: "",
    tags: "",
    isPublished: false,
    publishedDate: "",
  })

  useEffect(() => {
    loadBlogData().then((blogData) => {
      setData(blogData)

      if (isEditing && postId) {
        const post = blogData.posts.find((p: Post) => p.id.toString() === postId)
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            image: post.image || "",
            authorId: post.authorId,
            categoryId: post.categoryId,
            tags: post.tags.join(", "),
            isPublished: post.isPublished || false,
            publishedDate: post.publishedDate || "",
          })
        }
      }
    })
  }, [postId, isEditing])

  const generateUniqueId = () => {
    if (!data) return 1
    const existingIds = data.posts.map((post) => Number.parseInt(post.id.toString()))
    const maxId = Math.max(...existingIds, 0)
    return maxId + 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data) return

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const postData = {
      id: isEditing ? Number.parseInt(postId!) : generateUniqueId(),
      title: formData.title,
      content: formData.content,
      image: formData.image,
      authorId: formData.authorId,
      categoryId: formData.categoryId,
      tags: tags,
      isPublished: formData.isPublished,
      publishedDate: formData.publishedDate,
    }

    let updatedData: BlogData

    if (isEditing) {
      // Update existing post
      updatedData = {
        ...data,
        posts: data.posts.map((post) => (post.id.toString() === postId ? postData : post)),
      }
    } else {
      // Add new post
      updatedData = {
        ...data,
        posts: [postData, ...data.posts],
      }
    }

    // Save to localStorage
    saveBlogData(updatedData)
    setData(updatedData)

    console.log(isEditing ? "Updated post:" : "Created post:", postData)

    if (isEditing) {
      router.push(`/post/${postId}`)
    } else {
      router.push("/")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  // Show the Create Post form if no post ID is in the URL
  if (isCreating) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/manage-post"
              className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6"
            >
              ← Back to Manage Posts
            </Link>
            <h1 className="text-4xl md:text-6xl font-thin text-white">CREATE POST</h1>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <select
                  id="authorId"
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an author</option>
                  {data.authors.map((author) => (
                    <option key={author.authorId} value={author.authorId}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {data.categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, javascript, web-development"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                className="rounded text-green-600 border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Published
              </label>
            </div>

            <div className="flex gap-4 justify-center pt-8">
              <button
                type="submit"
                className="px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg"
                style={{ backgroundColor: "#7ACB59" }}
              >
                Create Post
              </button>
              <Link
                href={"/"}
                className="px-8 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors rounded-lg"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Show the list of all posts if not creating a new one or editing a specific one
  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-thin text-white">Manage Posts</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex justify-end">
          <Link
            href="/manage-post/new"
            className="inline-block px-4 py-2 text-white hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: "#7ACB59" }}
          >
            Create New Post
          </Link>
        </div>
        <ul className="space-y-4">
          {data.posts.map((post) => (
            <li key={post.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <Link href={`/manage-post/${post.id}`} className="text-lg font-bold text-gray-800 hover:text-blue-500">
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {post.isPublished ? "Published" : "Draft"}
                  </p>
                </div>
                <Link
                  href={`/manage-post/${post.id}`}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}