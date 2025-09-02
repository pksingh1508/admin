"use client";

import { UserButton } from "@clerk/nextjs";
import { inter } from "@/fonts/fonts";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`${inter.className} fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Heading */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
            >
              Blogs
            </Link>
            <Link
              href="/news"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
            >
              News
            </Link>
          </div>

          {/* Right side - User Button and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard:
                    "bg-gray-800 border border-gray-700 text-white",
                  userButtonPopoverActionButton: "hover:bg-gray-700 text-white",
                  userButtonPopoverActionButtonText: "text-white",
                  userButtonPopoverFooter: "border-t border-gray-700"
                }
              }}
            />
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/blogs"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
              >
                Blogs
              </Link>
              <Link
                href="/news"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
              >
                News
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
