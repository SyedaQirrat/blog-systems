"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadBlogData, createBlog, updateBlog, deleteBlog, BlogData, Post } from "@/lib/data-service";
import dynamic from "next/dynamic";

// Dynamically import CKEditorComponent
const CKEditorComponent = dynamic(() => import("@/components/CKEditorComponent"), { ssr: false });

export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter();
  const postId = params?.params?.[0];
  const isEditing = !!postId && postId !== "all" && postId !== "new";
  const isCreating = postId === "new";

  const [data, setData] = useState<BlogData | null>(null);
  const [formData, setFormData] = useState<{
    _id?: string;
    title: string;
    content: string;
    description: string;
    tags: string;
    isPublished: boolean;
    seriesId: string | null;
    file: File | null;
    category: string;
  }>({
    _id: undefined,
    title: "",
    content: "",
    description: "",
    tags: "",
    isPublished: true,
    seriesId: null,
    file: null,
    category: ""
  });

  useEffect(() => {
    loadBlogData().then((blogData) => {
      setData(blogData);

      if (isEditing && postId) {
        const post = blogData.posts.find((p: Post) => p._id === postId);
        if (post) {
          setFormData({
            _id: post._id,
            title: post.title,
            content: post.content,
            description: post.description,
            tags: post.tags,
            isPublished: post.isPublished || false,
            seriesId: post.seriesId || null,
            file: null,
            category: post.category
          });
        }
      }
    });
  }, [postId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    let idToRedirect = isEditing ? postId : undefined;

    try {
      if (isEditing) {
        const postData = {
          _id: postId!,
          title: formData.title,
          content: formData.content,
          description: formData.description,
          tags: formData.tags,
          isPublished: formData.isPublished,
          seriesId: formData.seriesId,
          category: formData.category,
        };
        await updateBlog(postData);
      } else {
        const postData = {
          title: formData.title,
          content: formData.content,
          description: formData.description,
          tags: formData.tags,
          isPublished: formData.isPublished,
          seriesId: formData.seriesId,
          category: formData.category,
        };
        const newPostResponse = await createBlog(postData);
        idToRedirect = newPostResponse.data._id;
      }

      router.push(idToRedirect ? `/post/${idToRedirect}` : "/");
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, file }));
  };
}