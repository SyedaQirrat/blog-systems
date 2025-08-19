"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { loadBlogData, deleteBlog, BlogData, Post, Series } from "@/lib/data-service"

export default function PostDetail({ params }: { params: { id: string } }) {
  const [data, setData] = useState<BlogData | null>(null)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadBlogData().then(setData)
  }, [])

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (data) {
        try {
          await deleteBlog(params.id);
          router.push("/");
        } catch (error) {
          console.error("Failed to delete post:", error);
          // Handle error display to the user if needed
        }
      }
    }
  }

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  const post = data.posts.find((p) => p._id === params.id)
  const parentSeries = post?.seriesId ? data.series.find(s => s._id === post.seriesId) : null;
  const postsInSeries = post?.seriesId ? data.posts.filter(p => p.seriesId === post.seriesId) : [];

  const author = data.authors.find((a) => a.authorId === post?.authorId)
  const category = data.categories.find((c) => c.categoryId === post?.categoryId)

  const handleImageError = () => {
    setImageError(true)
  }

  const getFallbackImage = () => {
    if (!post) return ""
    const colors = ["f97316", "fbbf24", "10b981", "3b82f6", "8b5cf6", "ec4899"]
    const color = colors[post._id.charCodeAt(0) % colors.length]
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodeURIComponent(post.title)}`
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/?category=${categoryId}`)
  }

  const handleTagClick = (tag: string) => {
    router.push(`/?tag=${tag}`)
  }

  if (!post) return <div className="min-h-screen bg-white flex items-center justify-center">Post not found</div>

  const images = Array.isArray(post.image) ? post.image : [post.image];
  const tagsArray = post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6">
            ← Back to Blog
          </Link>
          {parentSeries && (
            <Link href={`/series/${parentSeries._id}`} className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6 ml-4">
              ← Back to Parent Series: {parentSeries.title}
            </Link>
          )}

          <h1 className="text-4xl md:text-6xl font-thin mb-6 text-white">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7ACB59]">
            <span>by {author?.name}</span>
            <span>•</span>
            <button
              onClick={() => handleCategoryClick(post.categoryId)}
              className="text-[#7ACB59] hover:text-green-200 transition-colors underline font-bold"
            >
              {category?.name}
            </button>
            <span>•</span>
            <span>
              {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : 'Date Not Available'}
            </span>
            {post.isPublished ? (
              <span className="text-[#7ACB59]">• Published</span>
            ) : (
              <span className="text-red-500">• Draft</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {images.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((imgSrc, index) => (
              <div key={index} className="relative w-full aspect-[4/3]">
                <Image
                  src={imgSrc}
                  alt={`${post.title} image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {postsInSeries.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Posts in this Series</h2>
            <ul>
              {postsInSeries.map(seriesPost => (
                <li key={seriesPost._id} className="mb-2">
                  <Link href={`/post/${seriesPost._id}`} className="text-blue-600 hover:underline">
                    {seriesPost.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-12">
          {tagsArray.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="px-4 py-2 bg-gray-100 hover:bg-[#7ACB59] text-[#0E4772] hover:text-white rounded-full text-sm transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 text-center">
          <Link
            href={`/manage-post/${post._id}`}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: "#7ACB59" }}
          >
            Edit Post
          </Link>
          <button
            onClick={handleDeletePost}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: "#ff4d4f" }}
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  )
}