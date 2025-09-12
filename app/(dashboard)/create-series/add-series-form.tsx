"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSeries } from "@/lib/data";
import { useState } from "react";

export function AddSeriesForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Series title is required.");
      return;
    }
    try {
      await createSeries({ title, description });
      alert(`Series "${title}" created successfully!`);
      setTitle("");
      setDescription("");
      // In a real app, you'd trigger a re-fetch of the series list
    } catch (error) {
      alert("Failed to create series.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., A Guide to Branding"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="A short description of the series."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit">Create Series</Button>
    </form>
  );
}