"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadBlogData, deleteBlog, Post, Series, Author } from "@/lib/data-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const blogData = await loadBlogData();
        setPosts(blogData.posts);
        setSeries(blogData.series);
        setAuthors(blogData.authors);
      } catch (error) {
        console.error("Failed to load blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlog(id);
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const getSeriesTitle = (seriesId: string | null) => {
    if (!seriesId) return "N/A";
    const seriesItem = series.find((s) => s._id === seriesId);
    return seriesItem ? seriesItem.title : "Unknown";
  };

  const getAuthorName = (authorId: string) => {
    // This is a placeholder since author data is not in the Post object yet
    return "Admin"; 
  };

  if (loading) {
    return <div className="text-center py-12">Loading posts...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-4xl font-thin text-white">Manage Posts</h1>
          <Button asChild style={{ backgroundColor: "#7ACB59" }}>
            <Link href="/manage-post/new">Create New Post</Link>
          </Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date Published</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category || "N/A"}</TableCell>
                <TableCell>{getSeriesTitle(post.seriesId)}</TableCell>
                <TableCell>{getAuthorName(post.authorId)}</TableCell>
                <TableCell>
                  {post.publishedDate
                    ? new Date(post.publishedDate).toLocaleDateString()
                    : "Not Published"}
                </TableCell>
                <TableCell>
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/manage-post/${post._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}