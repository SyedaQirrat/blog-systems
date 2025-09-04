"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  categoryName: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  categoryDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log("Category Data:", values);
    // TODO: Integrate with API
    alert("Category data logged to console. See TODO in code.");
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white py-8" style={{ backgroundColor: "#0E4772" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Button onClick={() => router.back()} variant="link" className="inline-flex items-center text-[#7ACB59] hover:text-green-200 transition-colors mb-6 p-0">
            ← Back
          </Button>
          <h1 className="text-4xl md:text-6xl font-thin text-white">
            Create New Category
          </h1>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Card className="p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Category Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Category name here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of the category"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} style={{ backgroundColor: "#7ACB59" }}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}