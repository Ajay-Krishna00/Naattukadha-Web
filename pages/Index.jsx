"use client";
import { Link } from "react-router-dom";

import { Camera, MapPin, Music, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Discover Kerala's
            <span className="block bg-gradient-kerala bg-clip-text text-transparent">
              Cultural Heritage
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the rich traditions, taste authentic flavors, and listen to timeless melodies 
            of God's Own Country through immersive AR and curated content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/ar">
              <button size="lg" className="bg-gradient-primary shadow-soft hover:shadow-card transition-all duration-300 group">
                <Camera className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start AR Experience
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* AR Experiences Card */}
            <Link to="/ar" className="group">
              <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">AR Experiences</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Point your camera to discover 3D cultural models at specific locations. 
                  Watch Kathakali dancers, historic spice ships, and traditional artifacts come to life.
                </p>
              </div>
            </Link>

            {/* Restaurants Card */}
            <Link to="/restaurants" className="group">
              <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-kerala p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Kerala Restaurants</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find authentic Kerala restaurants near you. Discover traditional flavors, 
                  spices, and culinary heritage with detailed location guides.
                </p>
              </div>
            </Link>

            {/* Folk Music Card */}
            <Link to="/music" className="group">
              <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                <div className="bg-kerala-spice/80 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Folk Music</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Listen to traditional Kerala folk songs and melodies. 
                  Immerse yourself in the musical heritage passed down through generations.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;