"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

// Background images (place these in /public folder for Next.js!)
const bgimages = [
  { src: "/kathakali.jpg" },
  { src: "/houseboat.jpg" },
  { src: "/temple.jpg" },
  { src: "/padyani.jpg" },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgimages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation */}
      <nav className="relative bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-green-800 tracking-wide">
                NATTUKADHA AR
              </h1>
            </div>

            {/* Desktop Button */}
            <div className="hidden md:block">
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-green-700 hover:text-green-800 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-green-100">
                <button className="block w-full text-left bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full transition-colors duration-200 font-medium">
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 overflow-hidden flex items-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold text-green-900 leading-tight">
                  Discover Kerala&apos;s
                  <span className="block text-green-700">Cultural Heritage</span>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                  Experience the rich traditions, taste authentic flavors, and
                  listen to timeless melodies of God&apos;s Own Country through
                  immersive AR and curated content.
                </p>
              </div>
            </div>

            {/* Rotating Image */}
            <div className="relative">
              <div className="relative overflow-hidden shadow-2xl rounded-xl">
                <img
                  src={bgimages[currentIndex].src}
                  alt="Kerala heritage"
                  className="w-full h-[400px] lg:h-[550px] object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
