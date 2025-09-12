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
import { createCategory } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function AddCategoryDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name) return;
        await createCategory({ name, description });
        alert(`Category "${name}" created!`);
        setIsOpen(false);
        setName("");
        setDescription("");
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Categories help organize your posts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Tech Guides" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}