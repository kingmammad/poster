"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostItem({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: () => toast.error("Failed to delete post."),
  });

  // Edit dialog state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: (updatedPost: Post) =>
      axios.put(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully!");
      setOpen(false);
    },
    onError: () => toast.error("Failed to update post."),
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate({ id: post.id, title, body });
  };

  return (
    <>
      <Card className="py-0 shadow-none max-w-sm">
        <CardContent className="p-4 min-h-56 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-muted-foreground">{post.body}</p>
          </div>
          <div className="space-x-2 mt-2">
            <Button variant="outline" onClick={() => setOpen(true)}>
              ✏️ Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => deleteMutation.mutate(post.id)}
              disabled={deleteMutation.status === "pending"}
            >
              {deleteMutation.status === "pending" ? "Deleting..." : "❌ Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              required
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Post Body"
              rows={6}
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={editMutation.status === "pending"}>
                {editMutation.status === "pending" ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
