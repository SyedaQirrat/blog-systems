"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadBlogData, deleteblogs, Post, Series, Author } from "@/lib/data-service";
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
import { Trash, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        await deleteblogs(id);
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

  const getAuthorName = (authorId: string | undefined) => {
    if (!authorId) return "Admin"; // Default or placeholder
    const author = authors.find((a) => a.authorId === authorId);
    return author ? author.name : "Admin";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-4xl md:text-6xl font-thin text-white">Manage Posts</h1>
          <Button asChild style={{ backgroundColor: "#7ACB59" }}>
            <Link href="/manage-post/new">Create New Post</Link>
          </Button>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl py-12">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">No posts found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Series</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date Published</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category || 'N/A'}</TableCell>
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
                      <TableCell className="text-right space-x-2">
                        <Button asChild variant="outline" size="icon">
                          <Link href={`/manage-post/${post._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(post._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}