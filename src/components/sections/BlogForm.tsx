"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import BlogImageUpload from "@/components/upload/blog-image-upload";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BlogForm() {
  const { user } = useUser();
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const router = useRouter();

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
          placeholder: "Write your blog content here...",
          tools: {
            header: Header,
            paragraph: Paragraph
          },
          onReady: () => {
            console.log("EditorJS is ready to work!");
            setIsEditorReady(true);
          },
          onChange: (api, event) => {
            console.log("EditorJS content changed");
          }
        });

        // Wait for isReady; only set editorRef if initialization succeeded.
        await editor.isReady;
        if (isMounted) {
          editorRef.current = editor;
          console.log("EditorJS initialized successfully");
        }
      } catch (err: any) {
        console.error("Editor.js initialization failed:", err);
        toast.error("Failed to initialize editor");
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
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
      // Wait for editor to be fully ready before saving
      await editorRef.current.isReady;
      const content = await editorRef.current.save();
      
      console.log("Editor content:", content); // Debug log
      console.log("Content blocks:", content.blocks); // Debug blocks
      
      // Skip content validation for now - EditorJS content will be saved as-is
      console.log("Saving content without validation for debugging");

      const blogData = {
        title: title.trim(),
        authorname: authorName.trim() || user?.fullName || "Anonymous",
        commentscount: commentsCount,
        likescount: likesCount,
        content: JSON.stringify(content), // Store EditorJS content as JSON string
        imageurl: imageUrl.trim() || null,
        status: status.toLowerCase(),
        category: category.trim() || null,
        tags: tags.length > 0 ? tags : null,
        metatitle: metaTitle.trim() || null,
        metakeyword: metaKeyword.trim() || null,
        metadescription: metaDescription.trim() || null,
        useremail: user?.primaryEmailAddress?.emailAddress ?? "",
        postdate: new Date().toISOString(),
        updatedate: new Date().toISOString()
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from("blogs")
        .insert([blogData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Failed to save blog: ${error.message}`);
        return;
      }

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
      // navigate to the /blogs page
      router.push("/blogs");
    } catch (err: any) {
      console.error("Error saving blog:", err);
      toast.error("Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Create New Blog Post
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your thoughts and ideas with the world. Create engaging
            content with our powerful editor.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Title */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter an engaging blog title..."
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Author Name */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Author Name
                </label>
                <input
                  type="text"
                  placeholder="Author name"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
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
                  className={`min-h-[300px] border border-gray-300 rounded-lg p-4 bg-white ${
                    !isEditorReady ? "hidden" : ""
                  }`}
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
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
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
                  onChange={(e) =>
                    setStatus(e.target.value as "Draft" | "Published")
                  }
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              SEO Settings
            </h3>
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
              className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading
                ? "Saving..."
                : status === "Published"
                ? "Publish"
                : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
