"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { fetchSingleBlog, deleteBlogs, Post, loadBlogData } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comment-section";
import PostCard from "@/components/post-card"

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      try {
        setLoading(true);
        const postData = await fetchSingleBlog(params.id);
        setPost(postData);

        if (postData && postData.tags) {
          const allPostsData = await loadBlogData();
          const postTags = typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()) : [];
          
          const filteredPosts = allPostsData.posts.filter(p => {
            if (p._id === postData._id) return false;
            const pTags = typeof p.tags === 'string' ? p.tags.split(',').map(tag => tag.trim()) : [];
            return pTags.some(tag => postTags.includes(tag));
          }).slice(0, 4);
          
          setRelatedPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching post and related posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndRelated();
  }, [params.id]);

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (post) {
        try {
          await deleteBlogs(post._id);
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
  const tagsArray = typeof post.tags === 'string'
    ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8 bg-[#0E4772]">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-thin mb-6 text-white">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7ACB59]">
            {post.isPublished ? (
              <span className="text-[#7ACB59]">• Published</span>
            ) : (
              <span className="text-red-500">• Draft</span>
            )}
            {post.category && (
              <span className="text-[#7ACB59]">• {post.category}</span>
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
              onClick={() => router.push(`/blog?tag=${tag}`)}
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

        <CommentSection blogId={post._id} />

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <PostCard
                  key={relatedPost._id}
                  post={relatedPost}
                  getAuthorName={() => "Author"} 
                  getCategoryName={() => "Category"}
                  onCategoryClick={() => {}}
                  onTagClick={() => {}}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}