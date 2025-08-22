"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { createSeries } from "@/lib/data-service";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Update Zod schema to make description required
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
});

export default function CreateSeriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await createSeries({
        title: values.title,
        description: values.description,
        file: file,
        blogsId: [], // The API will handle this, but we need to provide it
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to create series:", error);
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
            Create New Series
          </h1>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Card className="p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Series Details</CardTitle>
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
                          placeholder="Series title here"
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
                          placeholder="A brief description of the series"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File input for images - handled separately from react-hook-form */}
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
                
                <Button type="submit" disabled={loading} style={{ backgroundColor: "#7ACB59" }}>
                  {loading ? "Creating..." : "Create Series"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}