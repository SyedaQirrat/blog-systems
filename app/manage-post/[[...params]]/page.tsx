"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
  faListUl,
  faListOl,
  faQuoteRight,
  faLink,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
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
    if (line.startsWith('* ')) {
      if (!inList) {
        result += '<ul>';
        inList = true;
      }
      result += `<li>${line.substring(2)}</li>`;
    } else if (line.startsWith('1. ')) {
      if (!inList) {
        result += '<ol>';
        inList = true;
      }
      result += `<li>${line.substring(3)}</li>`;
    } else {
      if (inList) {
        result += (line.startsWith('1. ') ? '</ol>' : '</ul>');
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


export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter()
  const postId = params?.params?.[0]
  const isEditing = !!postId && postId !== 'all' && postId !== 'new'
  const isCreating = postId === 'new'

  const [data, setData] = useState<BlogData | null>(null)
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    image: string[];
    authorId: string;
    categoryId: string;
    tags: string;
    isPublished: boolean;
    publishedDate: string;
  }>({
    title: "",
    content: "",
    image: [""],
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
          const contentString = Array.isArray(post.content) ? post.content.filter(block => block.type === 'text').map(block => block.value).join('\n') : post.content as string;
          const imageArray = Array.isArray(post.image) ? post.image : [post.image as string];
          setFormData({
            title: post.title,
            content: contentString,
            image: imageArray,
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
    const tags = formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
    const images = formData.image.filter(url => url.length > 0);
    const postData = {
      id: isEditing ? Number.parseInt(postId!) : generateUniqueId(),
      title: formData.title,
      content: formData.content,
      image: images,
      authorId: formData.authorId,
      categoryId: formData.categoryId,
      tags: tags,
      isPublished: formData.isPublished,
      publishedDate: formData.publishedDate,
    }
    let updatedData: BlogData
    if (isEditing) {
      updatedData = { ...data, posts: data.posts.map((post) => (post.id.toString() === postId ? postData : post)), }
    } else {
      updatedData = { ...data, posts: [postData, ...data.posts], }
    }
    saveBlogData(updatedData)
    setData(updatedData)
    if (isEditing) {
      router.push(`/post/${postId}`)
    } else {
      router.push("/")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLSelectElement> | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value, }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newImages = [...formData.image];
    newImages[index] = e.target.value;
    setFormData(prev => ({ ...prev, image: newImages }));
  }

  const handleAddImage = () => {
    setFormData(prev => ({ ...prev, image: [...prev.image, ""] }));
  }

  const handleRemoveImage = (index: number) => {
    const newImages = formData.image.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, image: newImages }));
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked, }))
  }
  
  const handleFormatText = (format: string, e: React.MouseEvent) => {
    e.preventDefault();
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textBefore = textarea.value.substring(0, start);
    const textAfter = textarea.value.substring(end);
    let newValue = selectedText;

    switch (format) {
      case 'h1':
        newValue = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        newValue = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        newValue = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'bold':
        newValue = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newValue = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        newValue = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'strikethrough':
        newValue = `~~${selectedText || 'strikethrough text'}~~`;
        break;
      case 'code':
        newValue = `\`${selectedText || 'code'}\``;
        break;
      case 'list-ul':
        newValue = `* ${selectedText || 'list item'}`;
        break;
      case 'list-ol':
        newValue = `1. ${selectedText || 'list item'}`;
        break;
      case 'quote':
        newValue = `> ${selectedText || 'blockquote'}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newValue = `[${selectedText || 'link text'}](${url})`;
        }
        break;
      case 'horizontal-line':
        newValue = '\n---\n';
        break;
      case 'image':
        const imageUrl = prompt('Enter Image URL:');
        if (imageUrl) {
          newValue = `![alt text](${imageUrl})\n`;
        }
        break;
      default:
        return;
    }
    
    setFormData(prev => ({ ...prev, content: textBefore + newValue + textAfter }));
    
    let newCursorPos = start + newValue.length;
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
};

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  if (isCreating || isEditing) {
    const postToEdit = isEditing ? data?.posts.find((p: Post) => p.id.toString() === postId) : null;
    const contentString = isEditing && postToEdit ? (Array.isArray(postToEdit.content) ? postToEdit.content.filter(block => block.type === 'text').map(block => block.value).join('\n') : postToEdit.content) as string : formData.content;

    return (
      <div className="min-h-screen bg-white">
        <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/manage-post/all"
              className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6"
            >
              ← Back to Manage Posts
            </Link>
            <h1 className="text-4xl md:text-6xl font-thin text-white">{isEditing ? "EDIT POST" : "CREATE POST"}</h1>
          </div>
        </div>

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

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Editor
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2">
                        <div className="flex flex-wrap space-x-2 mb-2">
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('h1', e)}
                            >
                                H1
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('h2', e)}
                            >
                                H2
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('h3', e)}
                            >
                                H3
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('bold', e)}
                            >
                                <FontAwesomeIcon icon={faBold} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('italic', e)}
                            >
                                <FontAwesomeIcon icon={faItalic} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('underline', e)}
                            >
                                <FontAwesomeIcon icon={faUnderline} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('strikethrough', e)}
                            >
                                <FontAwesomeIcon icon={faStrikethrough} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('code', e)}
                            >
                                <FontAwesomeIcon icon={faCode} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('list-ul', e)}
                            >
                                <FontAwesomeIcon icon={faListUl} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('list-ol', e)}
                            >
                                <FontAwesomeIcon icon={faListOl} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('quote', e)}
                            >
                                <FontAwesomeIcon icon={faQuoteRight} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('link', e)}
                            >
                                <FontAwesomeIcon icon={faLink} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('image', e)}
                            >
                                <FontAwesomeIcon icon={faImage} />
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs bg-gray-200 rounded text-black"
                                onClick={(e) => handleFormatText('horizontal-line', e)}
                            >
                                ---
                            </button>
                        </div>
                        <textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows={12}
                          placeholder="Write your post content here..."
                          className="w-full px-4 py-3 border-none focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-full overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }} />
                    </div>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              {formData.image.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageChange(e, index)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddImage} className="mt-2 px-4 py-2 border border-gray-300 rounded-lg">
                Add Image
              </button>
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
                Update Post
              </button>
              <Link
                href={"/manage-post/all"}
                className="px-8 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors rounded-lg"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6"
          >
            ← Back to Blog
          </Link>
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