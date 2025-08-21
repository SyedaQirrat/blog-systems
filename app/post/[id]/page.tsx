"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { fetchSingleBlog, deleteBlog, Post } from "@/lib/data-service"
import { Button } from "@/components/ui/button"

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchSingleBlog(params.id)
      .then(postData => {
        setPost(postData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [params.id])

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (post) {
        try {
          await deleteBlog(post._id);
          router.push("/");
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Post not found</div>;
  }
  
  const images = post.image;
  // Safely split tags, providing an empty array if post.tags is not a string
  const tagsArray = typeof post.tags === 'string'
    ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8 bg-[#0E4772]">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-thin mb-6 text-white">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7ACB59]">
            {post.isPublished ? (
              <span className="text-[#7ACB59]">• Published</span>
            ) : (
              <span className="text-red-500">• Draft</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {images && images.length > 0 && (
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
        
        <div className="flex flex-wrap gap-2 mb-12">
          {tagsArray.map((tag, index) => (
            <button
              key={index}
              onClick={() => {}}
              className="px-4 py-2 bg-gray-100 hover:bg-[#7ACB59] text-[#0E4772] hover:text-white rounded-full text-sm transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 text-center">
          <Link
            href={`/manage-post/${post._id}`}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg bg-[#7ACB59]"
          >
            Edit Post
          </Link>
          <button
            onClick={handleDeletePost}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg bg-[#ff4d4f]"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  )
}