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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CKEditorComponent = dynamic(() => import("@/components/CKEditorComponent"), {
  ssr: false,
});

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
  allowComments: z.boolean().default(true), // New schema field
  seriesId: z.string().optional().nullable(),
  category: z.string().optional(),
  content: z.string().optional(),
});

export default function ManagePost({ params }: { params: { params?: string[] } }) {
  const router = useRouter();
  const postId = params?.params?.[0];
  const isEditing = !!postId && postId !== "all" && postId !== "new";
  const isCreating = postId === "new";

  const [data, setData] = useState<BlogData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      isPublished: true,
      allowComments: true, // Set a default value
      seriesId: null,
      category: "",
      content: "",
    },
  });

  useEffect(() => {
    loadBlogData().then((blogData) => {
      setData(blogData);

      if (isEditing && postId) {
        const post = blogData.posts.find((p: Post) => p._id === postId);
        if (post) {
          form.reset({
            title: post.title,
            description: post.description ?? "",
            tags: post.tags ?? "",
            isPublished: post.isPublished ?? false,
            allowComments: post.allowComments ?? true, // Load existing value
            seriesId: post.seriesId,
            category: post.category,
            content: post.content,
          });
        }
      }
    });
  }, [isEditing, postId, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!data) return;
    setLoading(true);

    try {
      if (isEditing) {
        await updateBlog({
          _id: postId!,
          ...values,
          description: values.description ?? "",
          tags: values.tags ?? "",
          content: values.content ?? "",
        });
      } else {
        await createBlog({
          title: values.title,
          content: values.content ?? "",
          description: values.description ?? "",
          tags: values.tags ?? "",
          seriesId: values.seriesId,
          isPublished: values.isPublished,
          allowComments: values.allowComments, // Pass new value
          file: file,
        });
        router.push("/");
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    setFile(newFile);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Button onClick={() => router.back()} variant="link" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6 p-0">
            ← Back
          </Button>
          <h1 className="text-4xl md:text-6xl font-thin text-white">
            {isCreating ? "Create New Post" : "Edit Post"}
          </h1>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Card className="p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your post title here"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="A brief description of the post"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="comma, separated, tags"
                            {...field}
                          />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a series" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data?.series.map((s) => (
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
                </div>

                {/* New FormField for Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.categories.map((c) => (
                            <SelectItem key={c.categoryId} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File input for images - needs to be handled separately as it's not a standard input field for react-hook-form */}
                <div className="space-y-2">
                  <Label htmlFor="file-input">Feature Image</Label>
                  <Input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {file && <p className="text-sm text-muted-foreground mt-1">Selected file: {file.name}</p>}
                </div>

                {/* CKEditorComponent for content - controlled manually as it's a third-party component */}
                <div className="space-y-2">
                  <Label>Content</Label>
                  <CKEditorComponent
                    value={form.getValues("content") ?? ""}
                    onChange={(editorData) => form.setValue("content", editorData)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Published</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Toggle to make this post public.
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* New FormField for allowComments */}
                  <FormField
                    control={form.control}
                    name="allowComments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Allow Comments</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Toggle to allow readers to comment on this post.
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} style={{ backgroundColor: "#7ACB59" }}>
                    {loading ? "Saving..." : isCreating ? "Create" : "Update"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}