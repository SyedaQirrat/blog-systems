"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the expected props for the form
interface CommentFormProps {
  blogId: string;
  onSubmitComment: (commentData: { authorName: string; authorEmail: string; content: string }) => void;
  loading: boolean;
}

export const CommentForm = ({ blogId, onSubmitComment, loading }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !authorName || !authorEmail) {
      alert("Please fill out all fields.");
      return;
    }
    onSubmitComment({ content, authorName, authorEmail });
    setContent("");
    setAuthorName("");
    setAuthorEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Leave a Comment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} placeholder="Your email" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your comment here..." required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  );
};