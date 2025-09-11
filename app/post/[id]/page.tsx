"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { fetchSingleBlog, deleteblogs, Post, Series, loadBlogData } from "@/lib/data-service"
import { CommentSection } from "@/components/comment-section";
import PostCard from "@/components/post-card"

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [seriesTitle, setSeriesTitle] = useState<string | null>(null); // State for the series title
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      try {
        setLoading(true);
        const postData = await fetchSingleBlog(params.id);
        setPost(postData);

        // After fetching the post, fetch all blog data to find series title and related posts
        if (postData) {
          const allData = await loadBlogData(1, 100); // Fetch all data

          // Find and set the series title if the post belongs to one
          if (postData.seriesId) {
            const currentSeries = allData.series.find(s => s._id === postData.seriesId);
            if (currentSeries) {
              setSeriesTitle(currentSeries.title);
            }
          }

          // Find related posts based on tags
          if (postData.tags) {
            const postTags = typeof postData.tags === 'string' ? postData.tags.split(',').map(tag => tag.trim()) : [];
            const filteredPosts = allData.posts.filter(p => {
              if (p._id === postData._id) return false;
              const pTags = typeof p.tags === 'string' ? p.tags.split(',').map(tag => tag.trim()) : [];
              return pTags.some(tag => postTags.includes(tag));
            }).slice(0, 4);
            setRelatedPosts(filteredPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching post and related data:", error);
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
          await deleteblogs(post._id);
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
  
  const imageSrc = post.imageUrl || (post.image && post.image[0]);
  const tagsArray = typeof post.tags === 'string'
    ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];
  
  const getAuthorName = () => "Admin";
  const getCategoryName = () => post.category;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center space-x-4 mb-4">
            <Link href="/blog" className="text-sm transition-colors hover:opacity-80" style={{ color: "#7ACB59" }}>
              ← Back to Blog
            </Link>

            {/* Conditionally render the "Back to Series" link */}
            {post.seriesId && seriesTitle && (
              <Link href={`/series/${post.seriesId}`} className="text-sm transition-colors hover:opacity-80" style={{ color: "#0E4772" }}>
                ← Back to Series: {seriesTitle}
              </Link>
            )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#0E4772" }}>{post.title}</h1>
        
        {/* ... Rest of the component ... */}
        
        <p className="text-lg text-gray-600 mb-6">{post.description}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-8 border-t border-b py-4">
          <span>
            Published on {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
          </span>
          <span className="text-gray-300">|</span>
          <span>By {getAuthorName()}</span>
          <span className="text-gray-300">|</span>
          <span className="capitalize">{getCategoryName()}</span>
           <span className="text-gray-300">|</span>
           {tagsArray.map((tag, index) => (
            <button
              key={index}
              onClick={() => router.push(`/blog?tag=${tag}`)}
              className="px-3 py-1 text-white rounded-full text-xs transition-colors hover:opacity-90"
              style={{ backgroundColor: "#7ACB59" }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {imageSrc && (
          <div className="relative w-full aspect-video mb-8">
            <Image
              src={imageSrc} 
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8 text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="flex justify-center gap-4 text-center border-t pt-8">
          <Link
            href={`/manage-post/${post._id}`}
            className="inline-block px-6 py-2 text-white transition-colors rounded-md hover:opacity-90"
            style={{ backgroundColor: "#0E4772" }}
          >
            Edit Post
          </Link>
          <button
            onClick={handleDeletePost}
            className="inline-block px-6 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md"
          >
            Delete Post
          </button>
        </div>

        {post.allowComments && <CommentSection blogId={post._id} />}

        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#0E4772" }}>Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <PostCard
                  key={relatedPost._id}
                  post={relatedPost}
                  getAuthorName={getAuthorName}
                  getCategoryName={getCategoryName}
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