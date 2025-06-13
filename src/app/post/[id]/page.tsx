"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  body: string;
};

const fetchPost = async (postId: number): Promise<Post> => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  return res.data;
};

const PostDetails = () => {
  const params = useParams();
  const id = params?.id;
  const postId =
    typeof id === "string"
      ? parseInt(id)
      : Array.isArray(id) && id.length > 0
      ? parseInt(id[0])
      : 0;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: postId > 0,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Post</h1>
            <p className="text-muted-foreground">Failed to load post. Please try again later.</p>
            <Link href="/">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {isLoading ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ) : post ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed ">
                    {post.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>Post not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
