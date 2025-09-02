import React from "react";
import Link from "next/link";
import { Eye, Plus, Users, BookOpen, Newspaper } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-6">
          {/* See All Contacts */}
          <Link href="/contacts">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                See All Contacts
              </h3>
              <p className="text-gray-600 text-center mb-4">
                View and manage all your contacts in one place
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <Eye className="w-4 h-4 mr-2" />
                <span className="font-medium">View Contacts</span>
              </div>
            </div>
          </Link>

          {/* See All Blogs */}
          <Link href="/blogs" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                See All Blogs
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Browse through all your published blog posts
              </p>
              <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                <Eye className="w-4 h-4 mr-2" />
                <span className="font-medium">View Blogs</span>
              </div>
            </div>
          </Link>

          {/* See All News */}
          <Link href="/news" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto group-hover:bg-purple-200 transition-colors">
                <Newspaper className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                See All News
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Check out all your news articles and updates
              </p>
              <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                <span className="font-medium">View News</span>
              </div>
            </div>
          </Link>

          {/* Add New Blog */}
          <Link href="/addBlogs" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6 mx-auto group-hover:bg-orange-200 transition-colors">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Add New Blog
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Create and publish a new blog post
              </p>
              <div className="flex items-center justify-center text-orange-600 group-hover:text-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-medium">Create Blog</span>
              </div>
            </div>
          </Link>

          {/* Add New News */}
          <Link href="/addNews" className="group">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto group-hover:bg-red-200 transition-colors">
                <Plus className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Add New News
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Create and publish a new news article
              </p>
              <div className="flex items-center justify-center text-red-600 group-hover:text-red-700">
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-medium">Create News</span>
              </div>
            </div>
          </Link>

          {/* Statistics Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Contacts:</span>
                  <span className="font-bold">--</span>
                </div>
                <div className="flex justify-between">
                  <span>Blogs:</span>
                  <span className="font-bold">--</span>
                </div>
                <div className="flex justify-between">
                  <span>News:</span>
                  <span className="font-bold">--</span>
                </div>
              </div>
              <p className="text-indigo-200 text-sm mt-4">
                Stats will update automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
