"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Blog {
  id: string;
  title: string;
  authorname: string;
  imageurl: string;
  postdate: string;
  updatedate: string;
  status: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, authorname, imageurl, postdate, updatedate, status")
        .order("postdate", { ascending: false });

      if (error) {
        throw error;
      }

      setBlogs(data || []);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      setDeletingId(blogId);
      const { error } = await supabase.from("blogs").delete().eq("id", blogId);

      if (error) {
        throw error;
      }

      // Remove the deleted blog from state
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted successfully");
      router.push("/");
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-400">Error loading blogs: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover our latest articles and insights
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No blogs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer"
                onClick={() => router.push(`/blogs/${blog.id}`)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {blog.imageurl ? (
                    <img
                      src={blog.imageurl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📝</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

                  {/* Delete Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(blog.id);
                    }}
                    disabled={deletingId === blog.id}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    size="sm"
                  >
                    {deletingId === blog.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                    {blog.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center text-gray-300 mb-4">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">{blog.authorname}</span>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Posted: {formatDate(blog.postdate)}</span>
                    </div>
                    {blog.updatedate !== blog.postdate && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Updated: {formatDate(blog.updatedate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
