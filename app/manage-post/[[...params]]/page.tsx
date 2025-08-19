"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { CKEditorComponent } from "@/components/CKEditorComponent"
import { loadBlogData, saveBlogData, deleteBlog, BlogData, Post, Series } from "@/lib/data-service"

export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter()
  const postId = params?.params?.[0]
  const isEditing = !!postId && postId !== 'all' && postId !== 'new'
  const isCreating = postId === 'new'

  const [data, setData] = useState<BlogData | null>(null)
  const [formData, setFormData] = useState<{
    _id?: string;
    title: string;
    content: string;
    description: string;
    tags: string;
    isPublished: boolean;
    seriesId: string | null;
    image: string[];
  }>({
    _id: undefined,
    title: "",
    content: "",
    description: "",
    tags: "",
    isPublished: false,
    seriesId: null,
    image: [""]
  })

  useEffect(() => {
    loadBlogData().then((blogData) => {
      setData(blogData)

      if (isEditing && postId) {
        const post = blogData.posts.find((p: Post) => p._id === postId)
        if (post) {
          setFormData({
            _id: post._id,
            title: post.title,
            content: post.content,
            description: post.description,
            tags: post.tags,
            isPublished: post.isPublished || false,
            seriesId: post.seriesId || null,
            image: post.image || ['']
          })
        }
      }
    })
  }, [postId, isEditing])

  const generateUniqueId = () => {
    if (!data) return "1"
    const existingIds = data.posts.map((post) => Number.parseInt(post._id))
    const maxId = Math.max(...existingIds, 0)
    return String(maxId + 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    const postData = {
      _id: isEditing ? postId : generateUniqueId(),
      title: formData.title,
      content: formData.content,
      description: formData.description,
      tags: formData.tags,
      isPublished: formData.isPublished,
      seriesId: formData.seriesId,
      image: formData.image.filter(url => url.length > 0)
    }
    
    try {
      await saveBlogData(postData as Post);
      router.push(isEditing ? `/post/${postId}` : "/");
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value, }))
  }
  
  const handleEditorChange = (data: string) => {
    setFormData(prev => ({ ...prev, content: data }));
  };

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

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>

  if (isCreating || isEditing) {
    const postToEdit = isEditing ? data?.posts.find((p: Post) => p._id === postId) : null;
    const topLevelPosts = data?.posts.filter(p => !p.seriesId && p._id !== postId) || [];

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
            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={postToEdit?.categoryId || ""}
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
              <label htmlFor="seriesId" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Blog (Series)
              </label>
              <select
                id="seriesId"
                name="seriesId"
                value={formData.seriesId || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None</option>
                {topLevelPosts.map(post => (
                  <option key={post._id} value={post._id}>{post.title}</option>
                ))}
              </select>
            </div>
              <div>
                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <select
                  id="authorId"
                  name="authorId"
                  value={postToEdit?.authorId || ""}
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

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <CKEditorComponent value={formData.content} onChange={handleEditorChange} />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter a short description of the post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

  const deleteAndRedirect = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteBlog(id);
      router.push('/manage-post/all');
    }
  };

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
            <li key={post._id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <Link href={`/manage-post/${post._id}`} className="text-lg font-bold text-gray-800 hover:text-blue-500">
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {post.isPublished ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/manage-post/${post._id}`}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteAndRedirect(post._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}