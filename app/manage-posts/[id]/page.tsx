"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { loadBlogData, createBlog, updateBlog, fetchSingleBlog, Post, Category, Series } from "@/lib/data-service";
import CKEditorComponent from "@/components/CKEditorComponent";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  seriesId: z.string({ required_error: "Please select a series." }).min(1, { message: "A series is required." }),
  category: z.string({ required_error: "Please select a category." }).min(1, { message: "Please select a category." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
});

export default function ManagePostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  
  const { id: postId } = params;
  const isEditMode = postId !== "new";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      isPublished: true,
      allowComments: true,
      seriesId: "",
      category: "",
      content: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const blogData = await loadBlogData();
        setCategories(blogData.categories);
        setSeries(blogData.series);

        if (isEditMode) {
          const post = await fetchSingleBlog(postId);
          form.reset({
            title: post.title,
            description: post.description,
            tags: post.tags,
            isPublished: post.isPublished,
            allowComments: post.allowComments,
            seriesId: post.seriesId,
            category: post.category,
            content: post.content,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId, isEditMode, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await updateBlog({ _id: postId, ...values });
      } else {
        await createBlog(values);
      }
      router.push("/manage-posts");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8">
        <Button onClick={() => router.back()} variant="link" className="p-0">
          ← Back to Posts
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Card className="p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., tech, productivity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seriesId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a series for this post" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {series.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.categoryId} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div className="text-black">
                        <CKEditorComponent value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-4 pt-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="isPublished"
                        />
                      </FormControl>
                      <FormLabel htmlFor="isPublished" className="font-normal cursor-pointer">Publish</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="allowComments"
                        />
                      </FormControl>
                      <FormLabel htmlFor="allowComments" className="font-normal cursor-pointer">Allow Comments</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary-accent hover:bg-primary-accent/90">
                {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Post" : "Create Post")}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
    </>
  );
}