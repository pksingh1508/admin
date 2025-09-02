"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  title: string;
  authorname: string;
  imageurl: string;
  postdate: string;
  updatedate: string;
  status: string;
  content: string;
  category: string;
  tags: string[];
  metatitle: string;
  metadescription: string;
  metakeyword: string;
  commentscount: number;
  likescount: number;
}

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [params.id]);

  const fetchBlog = async (blogId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (error) {
        throw error;
      }

      setBlog(data);
    } catch (err: any) {
      console.error("Error fetching blog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const renderContent = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.blocks?.map((block: any, index: number) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                {block.data.text}
              </p>
            );
          case "header":
            if (block.data.level === 1) {
              return (
                <h1 key={index} className="text-3xl font-bold text-white mb-4">
                  {block.data.text}
                </h1>
              );
            } else if (block.data.level === 2) {
              return (
                <h2 key={index} className="text-2xl font-bold text-white mb-4">
                  {block.data.text}
                </h2>
              );
            } else if (block.data.level === 3) {
              return (
                <h3 key={index} className="text-xl font-bold text-white mb-4">
                  {block.data.text}
                </h3>
              );
            } else {
              return (
                <h4 key={index} className="text-lg font-bold text-white mb-4">
                  {block.data.text}
                </h4>
              );
            }
          case "list":
            return block.data.style === "ordered" ? (
              <ol key={index} className="list-decimal list-inside mb-4 text-gray-300 space-y-2">
                {block.data.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="list-disc list-inside mb-4 text-gray-300 space-y-2">
                {block.data.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={index} className="border-l-4 border-blue-500 pl-4 mb-4 italic text-gray-300">
                {block.data.text}
              </blockquote>
            );
          default:
            return (
              <div key={index} className="mb-4 text-gray-300">
                {block.data.text || JSON.stringify(block.data)}
              </div>
            );
        }
      });
    } catch {
      return <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-400 mb-4">
              {error || "Blog not found"}
            </p>
            <Button
              onClick={() => router.push("/blogs")}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/blogs")}
          variant="outline"
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Button>

        {/* Blog Content */}
        <article className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Featured Image */}
          {blog.imageurl && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={blog.imageurl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{blog.authorname}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Posted: {formatDate(blog.postdate)}</span>
              </div>
              {blog.updatedate !== blog.postdate && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Updated: {formatDate(blog.updatedate)}</span>
                </div>
              )}
            </div>

            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {blog.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {blog.category}
                </span>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              {blog.content ? renderContent(blog.content) : (
                <p className="text-gray-300">No content available.</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-600">
              <div className="text-gray-400">
                <span className="font-medium">{blog.likescount || 0}</span> Likes
              </div>
              <div className="text-gray-400">
                <span className="font-medium">{blog.commentscount || 0}</span> Comments
              </div>
              <div className="ml-auto">
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
        </article>
      </div>
    </div>
  );
}
