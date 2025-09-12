"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSeries } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function AddSeriesDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!title) return;
        await createSeries({ title, description });
        alert(`Series "${title}" created!`);
        setIsOpen(false);
        setTitle("");
        setDescription("");
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Series
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Series</DialogTitle>
          <DialogDescription>
            Series help group related posts together.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Getting Started Guide" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of the series." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Series</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}