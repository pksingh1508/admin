"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import BlogImageUpload from "@/components/upload/blog-image-upload";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogForm() {
  const { user } = useUser();
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Safety guards
    if (typeof window === "undefined") return; // client-only
    if (editorRef.current) return; // already initialized
    if (!holderRef.current) return; // holder must exist

    let isMounted = true;

    // Dynamically import EditorJS and tools to avoid SSR issues
    const initializeEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;

        const editor = new EditorJS({
          holder: holderRef.current!,
          autofocus: true,
          placeholder: "Write your blog here...",
          tools: {
            header: Header,
            paragraph: Paragraph,
          },
          onReady: () => {
            setIsEditorReady(true);
          },
        });

        // Wait for isReady; only set editorRef if initialization succeeded.
        await editor.isReady;
        if (isMounted) {
          editorRef.current = editor;
        }
      } catch (err: any) {
        console.error("Editor.js initialization failed:", err);
      }
    };

    initializeEditor();

    return () => {
      isMounted = false;
      setIsEditorReady(false);
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        try {
          editorRef.current.destroy();
        } catch (err: any) {
          console.warn("Error destroying editor:", err);
        } finally {
          editorRef.current = null;
        }
      } else {
        editorRef.current = null;
      }
    };
  }, []);

  // Helper functions
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) {
      toast.error("Editor not ready");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);

    try {
      const content = await editorRef.current.save();

      const blogData = {
        title: title.trim(),
        authorName: authorName.trim() || user?.fullName || "Anonymous",
        commentsCount,
        likesCount,
        content,
        imageUrl: imageUrl.trim(),
        status,
        category: category.trim(),
        tags,
        metaTitle: metaTitle.trim(),
        metaKeyword: metaKeyword.trim(),
        metaDescription: metaDescription.trim(),
        userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
        createdAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      console.log("Blog data to save:", blogData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Blog ${status.toLowerCase()} successfully!`);
      
      // Reset form
      setTitle("");
      setAuthorName("");
      setCommentsCount(0);
      setLikesCount(0);
      setImageUrl("");
      setStatus("Draft");
      setCategory("");
      setTags([]);
      setMetaTitle("");
      setMetaKeyword("");
      setMetaDescription("");
      
      // Clear editor
      if (editorRef.current) {
        editorRef.current.clear();
      }
      
    } catch (err) {
      console.error("Error saving blog:", err);
      toast.error("Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                placeholder="Author name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              {!isEditorReady && (
                <div className="min-h-[300px] border border-gray-300 rounded-lg p-4 bg-white flex items-center justify-center">
                  <div className="text-gray-500">Loading editor...</div>
                </div>
              )}
              <div
                ref={holderRef}
                className={`min-h-[300px] border border-gray-300 rounded-lg p-4 bg-white ${!isEditorReady ? 'hidden' : ''}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                placeholder="Blog category"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag"
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add Tag
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <BlogImageUpload onImageUploaded={setImageUrl} />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload featured image
                  </p>
                </div>
              )}
              <input
                type="url"
                placeholder="Or paste image URL"
                className="w-full mt-2 border border-gray-300 rounded-lg p-2 text-sm"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={status}
                onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Comments Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments Count
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={commentsCount}
                onChange={(e) => setCommentsCount(Number(e.target.value))}
              />
            </div>

            {/* Likes Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Likes Count
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={likesCount}
                onChange={(e) => setLikesCount(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                placeholder="SEO title"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                placeholder="SEO keywords"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={metaKeyword}
                onChange={(e) => setMetaKeyword(e.target.value)}
              />
            </div>

            {/* Meta Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="SEO description"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStatus("Draft")}
            disabled={isLoading}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : status === "Published" ? "Publish" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
