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
  content: PostContent[] | string
  image: string[] | string
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

const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  const renderedContent: React.ReactNode[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      renderedContent.push(React.createElement('ul', { key: `ul-${renderedContent.length}` }));
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('* ')) {
      if (!inList) {
        renderedContent.push(React.createElement('ul', { key: `ul-${renderedContent.length}` }));
        inList = true;
      }
      const listItemText = line.substring(2);
      renderedContent.push(React.createElement('li', { key: `li-${index}` }, listItemText));
      return;
    } else {
      closeList();
    }

    if (line.startsWith('1. ')) {
      if (!inList) {
        renderedContent.push(React.createElement('ol', { key: `ol-${renderedContent.length}` }));
        inList = true;
      }
      const listItemText = line.substring(3);
      renderedContent.push(React.createElement('li', { key: `li-${index}` }, listItemText));
      return;
    } else {
      closeList();
    }

    if (line.startsWith('# ')) {
      renderedContent.push(React.createElement('h1', { key: `h1-${index}` }, line.substring(2)));
      return;
    }
    if (line.startsWith('## ')) {
      renderedContent.push(React.createElement('h2', { key: `h2-${index}` }, line.substring(3)));
      return;
    }
    if (line.startsWith('### ')) {
      renderedContent.push(React.createElement('h3', { key: `h3-${index}` }, line.substring(4)));
      return;
    }
    if (line.startsWith('> ')) {
      renderedContent.push(React.createElement('blockquote', { key: `blockquote-${index}` }, line.substring(2)));
      return;
    }
    if (line.startsWith('---')) {
      renderedContent.push(React.createElement('hr', { key: `hr-${index}` }));
      return;
    }

    let textToRender: React.ReactNode[] = [];
    let remainingText = line;
    let match;

    // Bold, Italic, Underline, Strikethrough, Code, Links
    const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|`.*?`|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;

    while ((match = regex.exec(remainingText)) !== null) {
        const precedingText = remainingText.substring(lastIndex, match.index);
        if (precedingText) {
            textToRender.push(precedingText);
        }

        const matchedText = match[0];
        if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
            textToRender.push(React.createElement('strong', { key: `bold-${index}-${match.index}` }, matchedText.slice(2, -2)));
        } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
            textToRender.push(React.createElement('em', { key: `italic-${index}-${match.index}` }, matchedText.slice(1, -1)));
        } else if (matchedText.startsWith('<u>') && matchedText.endsWith('</u>')) {
            textToRender.push(React.createElement('u', { key: `underline-${index}-${match.index}` }, matchedText.slice(3, -4)));
        } else if (matchedText.startsWith('~~') && matchedText.endsWith('~~')) {
            textToRender.push(React.createElement('s', { key: `strikethrough-${index}-${match.index}` }, matchedText.slice(2, -2)));
        } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
            textToRender.push(React.createElement('code', { key: `code-${index}-${match.index}` }, matchedText.slice(1, -1)));
        } else if (matchedText.startsWith('[') && matchedText.includes('](') && matchedText.endsWith(')')) {
            const linkText = matchedText.substring(1, matchedText.indexOf(']'));
            const linkUrl = matchedText.substring(matchedText.indexOf('](') + 2, matchedText.length - 1);
            textToRender.push(React.createElement('a', { key: `link-${index}-${match.index}`, href: linkUrl }, linkText));
        } else {
            textToRender.push(matchedText);
        }
        lastIndex = regex.lastIndex;
    }

    const remaining = remainingText.substring(lastIndex);
    if (remaining) {
        textToRender.push(remaining);
    }
    
    if (textToRender.length > 0) {
      renderedContent.push(React.createElement('p', { key: `p-${index}` }, ...textToRender));
    }
  });

  closeList();

  return <div className="prose prose-lg max-w-none mb-12">{renderedContent}</div>;
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
  const contentBlocks = Array.isArray(post.content) ? post.content : post.content.split("\n").map(text => ({ type: 'text', value: text }));

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6">
            ← Back to Blog
          </Link>

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

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Post Images */}
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

        {/* Post Content */}
        {contentBlocks.map((block, index) => {
          if (block.type === 'text') {
            return (
              <div key={index} className="mb-6 text-black leading-relaxed">
                {renderMarkdown(block.value)}
              </div>
            );
          }
          if (block.type === 'image') {
            return (
              <div key={index} className="my-6">
                <img src={block.value} alt="" className="w-full rounded-lg" />
              </div>
            );
          }
          return null;
        })}

        {/* Tags */}
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