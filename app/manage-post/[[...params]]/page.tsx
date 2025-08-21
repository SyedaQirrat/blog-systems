"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  loadBlogData,
  createBlog,
  updateBlog,
  BlogData,
  Post,
} from "@/lib/data-service";

const CKEditorComponent = dynamic(() => import("@/components/CKEditorComponent"), {
  ssr: false,
});

export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter();
  const postId = params?.params?.[0];
  const isEditing = !!postId && postId !== "all" && postId !== "new";
  const isCreating = postId === "new";

  const [data, setData] = useState<BlogData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    tags: "",
    isPublished: true,
    seriesId: null as string | null,
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBlogData().then((blogData) => {
      setData(blogData);

      if (isEditing && postId) {
        const post = blogData.posts.find((p: Post) => p._id === postId);
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            description: post.description,
            tags: post.tags,
            isPublished: post.isPublished ?? false,
            seriesId: post.seriesId,
            category: post.category,
          });
        }
      }
    });
  }, [isEditing, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setLoading(true);

    try {
      if (isEditing) {
        await updateBlog({
          _id: postId!,
          ...formData,
           isPublished: formData.isPublished,
        });
      } else {
        const response = await createBlog({
          ...formData,
           isPublished: formData.isPublished,
        });
        router.push(`/post/${response.data._id}`);
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    setFile(newFile);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{isCreating ? "Create New Post" : "Edit Post"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
        />
        <select
          name="seriesId"
          value={formData.seriesId || ""}
          onChange={handleChange}
        >
          <option value="">Select Series</option>
          {data?.series.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {file && <p>Selected file: {file.name}</p>}

        <CKEditorComponent
          value={formData.content}
          onChange={(data) => setFormData((prev) => ({ ...prev, content: data }))}
        />

        <label>
          Published:
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
            }
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isCreating ? "Create" : "Update"}
        </button>
      </form>
    </div>
  );
}
