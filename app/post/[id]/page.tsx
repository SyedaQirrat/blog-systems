"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"

interface PostContent {
  type: "text" | "image";
  value: string;
}

interface Post {
  id: number
  title: string
  content: string // Changed to store HTML string
  image: string[] | string
  authorId: string
  categoryId: string
  tags: string[]
  isPublished?: boolean
  publishedDate?: string
  parentId?: number | null
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
  const storedData = localStorage.getItem("blogData")
  if (storedData) {
    return JSON.parse(storedData)
  }

  const response = await fetch("/data.json")
  const data = await response.json()

  localStorage.setItem("blogData", JSON.stringify(data))
  return data
}

const saveBlogData = (data: BlogData) => {
  localStorage.setItem("blogData", JSON.stringify(data))
}

const renderMarkdown = (text: string): string => {
  let formattedText = text;

  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formattedText = formattedText.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
  formattedText = formattedText.replace(/~~(.*?)~~/g, '<s>$1</s>');
  formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
  formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  formattedText = formattedText.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg" />');

  const lines = formattedText.split('\n');
  let result = '';
  let inList = false;
  
  lines.forEach(line => {
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        result += '<ul>';
        inList = true;
      }
      result += `<li>${line.substring(2)}</li>`;
    } else if (line.match(/^\d+\. /)) {
        if (!inList) {
            result += '<ol>';
            inList = true;
        }
        result += `<li>${line.substring(line.indexOf('.') + 1).trim()}</li>`;
    } else {
        if (inList) {
            result += (line.match(/^\d+\. /) ? '</ol>' : '</ul>');
            inList = false;
        }
      if (line.startsWith('# ')) {
        result += `<h1>${line.substring(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        result += `<h2>${line.substring(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        result += `<h3>${line.substring(4)}</h3>`;
      } else if (line.startsWith('> ')) {
        result += `<blockquote>${line.substring(2)}</blockquote>`;
      } else if (line.startsWith('---')) {
        result += '<hr />';
      } else {
        result += `<p>${line}</p>`;
      }
    }
  });

  if (inList) {
    result += '</ul>'; // or </ol>
  }
  
  return result;
};


export default function PostDetail({ params }: { params: { id: string } }) {
  const [data, setData] = useState<BlogData | null>(null)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadBlogData().then(setData)
  }, [])

  const deletePost = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (data) {
        const updatedPosts = data.posts.filter(
          (post) => post.id.toString() !== params.id
        )
        const updatedData = { ...data, posts: updatedPosts }
        saveBlogData(updatedData)
        router.push("/")
      }
    }
  }

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  const post = data.posts.find((p) => p.id.toString() === params.id)
  const parentPost = post?.parentId ? data.posts.find(p => p.id === post.parentId) : null;
  const subBlogs = data.posts.filter(p => p.parentId === post?.id);

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

  const images = Array.isArray(post.image) ? post.image : [post.image];
  const contentString = Array.isArray(post.content) ? post.content.filter(block => block.type === 'text').map(block => block.value).join('\n') : post.content as string;

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6">
            ← Back to Blog
          </Link>
          {parentPost && (
            <Link href={`/post/${parentPost.id}`} className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6 ml-4">
              ← Back to Parent Blog
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
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(contentString) }} />
        </div>
        
        {subBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Sub-Blogs</h2>
            <ul>
              {subBlogs.map(subBlog => (
                <li key={subBlog.id} className="mb-2">
                  <Link href={`/post/${subBlog.id}`} className="text-blue-600 hover:underline">
                    {subBlog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag, index) => (
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
            href={`/manage-post/${post.id}`}
            className="inline-block px-8 py-3 text-white hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: "#7ACB59" }}
          >
            Edit Post
          </Link>
          <button
            onClick={deletePost}
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