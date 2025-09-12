"use client";

import React, { useState, useEffect } from "react"; // Keep useEffect for now, but its body can be empty or removed if not used elsewhere
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import CKEditorComponent from "@/components/CKEditorComponent";

export function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [editorLoaded, setEditorLoaded] = useState(false); // <-- DELETE THIS LINE
  
  // This hook is no longer needed for the editor
  // useEffect(() => {
  //   setEditorLoaded(true);
  // }, []); // <-- DELETE THIS ENTIRE HOOK

  const handleSubmit = (status: "Draft" | "Published") => {
    const postData = {
      title,
      content,
      status,
      // ... add other form fields here
    };
    console.log("Submitting Post:", postData);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          placeholder="Enter your post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Post Content</Label>
        <CKEditorComponent
          onChange={(data) => setContent(data)}
          // editorLoaded={editorLoaded} // <-- DELETE THIS PROP
          value={content}
        />
      </div>
      
      {/* ... rest of the form ... */}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => handleSubmit("Draft")}>
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit("Published")}>
          Publish Post
        </Button>
      </div>
    </div>
  );
}