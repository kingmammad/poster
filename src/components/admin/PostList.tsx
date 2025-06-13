"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostItem from "./PostItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";

export default function PostList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-56 w-sm shadow-none">
            <CardContent className="w-full">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) return <p className="text-red-500">Failed to load posts.</p>;

  return (
    <div className="flex w-full gap-5 justify-center items-center flex-wrap">
      {data.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
