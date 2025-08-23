"use client";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Camera, MapPin, Music } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/ar", label: "AR Experiences", icon: Camera },
    { path: "/restaurants", label: "Restaurants", icon: MapPin },
    { path: "/music", label: "Folk Music", icon: Music },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-nav">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-primary hover:text-primary-dark transition-colors"
          >
            Nattukaadha AR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    isActive(path)
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:text-primary hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(path) ? "default" : "ghost"}
                    className={`w-full justify-start gap-2 ${
                      isActive(path)
                        ? "bg-gradient-primary text-primary-foreground"
                        : "text-foreground hover:text-primary hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;