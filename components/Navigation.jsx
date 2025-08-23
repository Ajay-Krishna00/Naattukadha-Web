"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Camera, MapPin, Music, User } from "lucide-react";

// Reusable Button
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-xl hover:from-green-600 hover:to-emerald-700 active:scale-95",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-green-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();


  
  const isActive = (path) => pathname === path;

  const navItems = [
    { path: "/ar", label: "AR Experiences", icon: Camera },
    { path: "/restaurants", label: "Restaurants", icon: MapPin },
    { path: "/music", label: "Folk Music", icon: Music },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-green-200 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Nattukaadha AR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} href={path}>
                <div
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {!isActive(path) && (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full" />
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-green-200 flex flex-col space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} href={path} onClick={() => setIsOpen(false)}>
                <div
                  className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
