"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadBlogData, deleteblogs, Post, Series, Author, Category } from "@/lib/data-service";
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
import { Header } from "@/components/header";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
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
        setCategories(blogData.categories); // Load categories into state
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
    if (!authorId) return "Admin";
    const author = authors.find((a) => a.authorId === authorId);
    return author ? author.name : "Admin";
  };

  // Function to look up the category name from its ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return "N/A";
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : categoryId; // Fallback to ID if not found
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl py-12">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">Loading posts...</div>
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
                      {/* Use the getCategoryName function to display the correct name */}
                      <TableCell>{getCategoryName(post.category)}</TableCell>
                      <TableCell>{getSeriesTitle(post.seriesId)}</TableCell>
                      <TableCell>{getAuthorName(post.authorId)}</TableCell>
                      <TableCell>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
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
    </>
  );
}