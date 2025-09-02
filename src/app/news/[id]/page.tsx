"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface News {
  id: string;
  title: string;
  imageurl: string;
  postdate: string;
  updatedate: string;
  status: string;
  content: string;
  category: string;
  tags: string[];
}

export default function SingleNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchNews(params.id as string);
    }
  }, [params.id]);

  const fetchNews = async (newsId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", newsId)
        .single();

      if (error) {
        throw error;
      }

      setNews(data);
    } catch (err: any) {
      console.error("Error fetching news:", err);
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
            // Handle inline formatting (bold, italic, marker, underline, links)
            const renderInlineText = (text: string) => {
              return <span dangerouslySetInnerHTML={{ __html: text }} />;
            };
            return (
              <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                {renderInlineText(block.data.text)}
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
              <ol key={index} className="list-decimal list-inside mb-4 text-gray-300 space-y-2">
                {block.data.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            ) : (
              <ul key={index} className="list-disc list-inside mb-4 text-gray-300 space-y-2">
                {block.data.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
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
                {block.data.items.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span 
                      className={`text-gray-300 ${item.checked ? 'line-through opacity-75' : ''}`}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </div>
                ))}
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
            <p className="text-gray-400 mt-4">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-400 mb-4">
              {error || "News not found"}
            </p>
            <Button
              onClick={() => router.push("/news")}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
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
          onClick={() => router.push("/news")}
          variant="outline"
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        {/* News Content */}
        <article className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Featured Image */}
          {news.imageurl && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={news.imageurl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {news.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Posted: {formatDate(news.postdate)}</span>
              </div>
              {news.updatedate !== news.postdate && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Updated: {formatDate(news.updatedate)}</span>
                </div>
              )}
            </div>

            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {news.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {news.category}
                </span>
              )}
              {news.tags && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
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

            {/* News Content */}
            <div className="prose prose-lg max-w-none">
              {news.content ? renderContent(news.content) : (
                <p className="text-gray-300">No content available.</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-end mt-8 pt-8 border-t border-gray-600">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  news.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {news.status}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
