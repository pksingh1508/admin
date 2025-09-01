"use client";
import React, { useState } from "react";
import { Upload, Image, Type, FileText, Eye, Save } from "lucide-react";

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    excerpt: "",
    tags: "",
    category: ""
  });

  const [uploadError, setUploadError] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setFormData((prev) => ({ ...prev, imageUrl: result }));
          setUploadError("");
        } else {
          setUploadError("Failed to load image. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Blog post data:", formData);
    // Handle form submission here
  };

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Business",
    "Health",
    "Education",
    "Entertainment"
  ];

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Preview</h1>
                <button
                  onClick={() => setIsPreview(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Type className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>

            <article className="p-8">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {formData.title || "Your Blog Title"}
              </h1>
              {formData.excerpt && (
                <p className="text-xl text-gray-600 mb-6 italic">
                  {formData.excerpt}
                </p>
              )}
              <div className="prose max-w-none">
                {formData.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {formData.tags && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create New Blog Post
                </h1>
                <p className="text-blue-100">
                  Share your thoughts with the world
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Title and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <Type className="w-5 h-5 text-blue-600" />
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter your blog title..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value
                    }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Excerpt (Optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of your post..."
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                <Image className="w-5 h-5 text-blue-600" />
                Featured Image
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                {formData.imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, imageUrl: "" }))
                      }
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-red-600 text-sm mt-2">{uploadError}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Start writing your blog post..."
                rows={12}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Enter tags separated by commas (e.g., react, javascript, web development)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] font-semibold text-lg shadow-lg"
              >
                <Save className="w-5 h-5" />
                Publish Blog Post
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
