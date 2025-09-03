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
              <p
                key={index}
                className="mb-4 text-gray-300 leading-relaxed prose-inline"
              >
                <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </p>
            );
          case "header":
            const headerText = <span dangerouslySetInnerHTML={{ __html: block.data.text }} />;
            if (block.data.level === 1) {
              return (
                <h1 key={index} className="text-3xl font-bold text-white mb-4">
                  {headerText}
                </h1>
              );
            } else if (block.data.level === 2) {
              return (
                <h2 key={index} className="text-2xl font-bold text-white mb-4">
                  {headerText}
                </h2>
              );
            } else if (block.data.level === 3) {
              return (
                <h3 key={index} className="text-xl font-bold text-white mb-4">
                  {headerText}
                </h3>
              );
            } else {
              return (
                <h4 key={index} className="text-lg font-bold text-white mb-4">
                  {headerText}
                </h4>
              );
            }
          case "list":
            return block.data.style === "ordered" ? (
              <ol
                key={index}
                className="list-decimal list-inside mb-4 text-gray-300 space-y-2"
              >
                {block.data.items.map((item: any, itemIndex: number) => {
                  const itemText =
                    typeof item === "string"
                      ? item
                      : item.content || item.text || JSON.stringify(item);
                  return (
                    <li
                      key={itemIndex}
                      dangerouslySetInnerHTML={{ __html: itemText }}
                    />
                  );
                })}
              </ol>
            ) : (
              <ul
                key={index}
                className="list-disc list-inside mb-4 text-gray-300 space-y-2"
              >
                {block.data.items.map((item: any, itemIndex: number) => {
                  const itemText =
                    typeof item === "string"
                      ? item
                      : item.content || item.text || JSON.stringify(item);
                  return (
                    <li
                      key={itemIndex}
                      dangerouslySetInnerHTML={{ __html: itemText }}
                    />
                  );
                })}
              </ul>
            );
          case "table":
            return (
              <div key={index} className="mb-4 overflow-x-auto">
                <table className="min-w-full border border-gray-600 rounded-lg">
                  <tbody>
                    {block.data.content.map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex} className="border-b border-gray-600">
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-gray-300 border-r border-gray-600 last:border-r-0"
                            dangerouslySetInnerHTML={{ __html: cell }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "checklist":
            return (
              <div key={index} className="mb-4 space-y-2">
                {block.data.items.map((item: any, itemIndex: number) => {
                  // Handle both string and object formats for checklist items
                  const itemText =
                    typeof item === "string"
                      ? item
                      : item.text || item.content || "";
                  const isChecked =
                    typeof item === "object" ? item.checked : false;

                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center space-x-3"
                    >
                      <span className="text-lg">{isChecked ? "✅" : "⬜"}</span>
                      <span
                        className={`text-gray-300 ${
                          isChecked ? "line-through opacity-75" : ""
                        }`}
                        dangerouslySetInnerHTML={{ __html: itemText }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          case "linkTool":
            return (
              <div key={index} className="mb-4 p-4 border border-gray-600 rounded-lg bg-gray-700/50">
                <a
                  href={block.data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {block.data.meta?.title || block.data.link}
                </a>
                {block.data.meta?.description && (
                  <p className="text-gray-400 text-sm mt-1">{block.data.meta.description}</p>
                )}
              </div>
            );
          case "quote":
            return (
              <blockquote key={index} className="border-l-4 border-blue-500 pl-4 mb-4 italic text-gray-300">
                <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </blockquote>
            );
          default:
            return (
              <div key={index} className="mb-4 text-gray-300">
                {typeof block.data.text === 'string' ? (
                  <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm bg-gray-700 p-3 rounded">
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                )}
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
              <style jsx>{`
                .prose-inline b,
                .prose-inline strong {
                  font-weight: bold;
                  color: #ffffff;
                }
                .prose-inline i,
                .prose-inline em {
                  font-style: italic;
                  color: #e5e7eb;
                }
                .prose-inline u {
                  text-decoration: underline;
                  text-decoration-color: #9ca3af;
                }
                .prose-inline mark {
                  background-color: #fbbf24;
                  color: #1f2937;
                  padding: 0.1em 0.2em;
                  border-radius: 0.2em;
                }
                .prose-inline a {
                  color: #3b82f6;
                  text-decoration: underline;
                  text-decoration-color: #3b82f6;
                  text-underline-offset: 2px;
                  text-decoration-thickness: 2px;
                  font-weight: 500;
                }
                .prose-inline a:hover {
                  color: #1d4ed8;
                  text-decoration-color: #1d4ed8;
                  background-color: rgba(59, 130, 246, 0.1);
                  padding: 1px 2px;
                  border-radius: 2px;
                }
              `}</style>
              {blog.content ? (
                renderContent(blog.content)
              ) : (
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
