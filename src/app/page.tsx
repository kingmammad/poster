"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
};

const fetchPosts = async (): Promise<Post[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return res.data;
};

const Home = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const truncateText = (text: string, maxLength: number = 150) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Error Loading Posts
            </h1>
            <p className="text-muted-foreground">
              Failed to load posts. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full  bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container w-full mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Poster
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and explore our collection of articles and stories
          </p>
        </div>

        {isLoading ? (
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
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {posts?.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block">
                <Card className="h-full max-w-sm shadow-none hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {truncateText(post.body)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
