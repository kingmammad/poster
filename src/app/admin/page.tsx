"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostForm from "@/components/admin/PostForm";
import PostList from "@/components/admin/PostList";

const queryClient = new QueryClient();

const Admin = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto py-10 space-y-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <PostForm />
    </div>
        <PostList />
      </div>
    </QueryClientProvider>
  );
}
export default Admin;