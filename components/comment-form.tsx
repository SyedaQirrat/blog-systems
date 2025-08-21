import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/data-service";

interface CommentFormProps {
  blogId: string;
  onSubmitComment: (comment: Omit<Comment, "_id" | "createdAt">) => Promise<void>;
  loading: boolean;
}

export function CommentForm({ blogId, onSubmitComment, loading }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !authorEmail || !content) {
      alert("Please fill in all fields."); // Replace with a proper toast/modal later
      return;
    }

    await onSubmitComment({ blogId, authorName, authorEmail, content });
    setAuthorName("");
    setAuthorEmail("");
    setContent("");
  };

  return (
    <div className="mt-8 p-6 border rounded-lg bg-gray-50">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          required
        />
        <Textarea
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <Button type="submit" disabled={loading} style={{ backgroundColor: "#7ACB59" }}>
          {loading ? "Submitting..." : "Submit Comment"}
        </Button>
      </form>
    </div>
  );
}