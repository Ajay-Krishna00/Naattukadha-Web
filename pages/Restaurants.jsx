"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ExternalLink, Search, Star, Clock } from "lucide-react";
import { toast } from "sonner";

// Sample restaurant data (replace with Google Places API integration)
const sampleRestaurants = [
  {
    id: "1",
    name: "Kerala Kitchen",
    description: "Authentic traditional Kerala cuisine with fresh spices and coconut-based curries. Famous for fish molee and appam.",
    image: "/images/kerala-kitchen.jpg", // Replace with actual image
    rating: 4.5,
    priceLevel: "$$",
    address: "MG Road, Kochi, Kerala",
    phone: "+91 484 2345678",
    hours: "11:00 AM - 10:00 PM",
    googlePlaceId: "ChIJ1234567890", // Replace with actual Google Place ID
    lat: 9.9312,
    lng: 76.2673,
  },
  {
    id: "2", 
    name: "Spice Garden Restaurant",
    description: "Traditional Malabar cuisine featuring seafood specialties and authentic Kerala breakfast items like puttu and kadala curry.",
    image: "/images/spice-garden.jpg",
    rating: 4.3,
    priceLevel: "$",
    address: "Fort Kochi, Kerala",
    phone: "+91 484 3456789",
    hours: "7:00 AM - 11:00 PM",
    googlePlaceId: "ChIJ0987654321",
    lat: 9.9658,
    lng: 76.2419,
  },
  {
    id: "3",
    name: "Backwater Delicacy",
    description: "Lakeside dining with fresh catch from Kerala backwaters. Specializes in karimeen fish and traditional boat house cuisine.",
    image: "/images/backwater-delicacy.jpg", 
    rating: 4.7,
    priceLevel: "$$$",
    address: "Alleppey Backwaters, Kerala",
    phone: "+91 477 2234567",
    hours: "12:00 PM - 9:00 PM",
    googlePlaceId: "ChIJ1122334455",
    lat: 9.4981,
    lng: 76.3388,
  },
  {
    id: "4",
    name: "Grandma's Kitchen",
    description: "Home-style Kerala cooking with recipes passed down through generations. Famous for sadya meals served on banana leaves.",
    image: "/images/grandmas-kitchen.jpg",
    rating: 4.4,
    priceLevel: "$",
    address: "Thrissur, Kerala", 
    phone: "+91 487 2345678",
    hours: "10:00 AM - 8:00 PM",
    googlePlaceId: "ChIJ5566778899",
    lat: 10.5276,
    lng: 76.2144,
  },
];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open Google Maps (replace googlePlaceId with actual IDs)
  const openInGoogleMaps = (restaurant) => {
    // Option 1: Using coordinates
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}&query_place_id=${restaurant.googlePlaceId}`;
    
    // Option 2: Using place name and address (fallback)
    // const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`;
    
    window.open(mapsUrl, "_blank");
    toast.success(`Opening ${restaurant.name} in Google Maps`);
  };

  // Function to integrate with Google Places API (to be implemented)
  const fetchNearbyRestaurants = async () => {
    setIsLoading(true);
    
    // TODO: Implement Google Places API integration
    // This requires a Google Places API key and proper backend implementation
    // For now, using sample data
    
    try {
      // Sample implementation:
      // const response = await fetch('/api/restaurants', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     location: userLocation,
      //     radius: 5000,
      //     type: 'restaurant',
      //     keyword: 'Kerala cuisine'
      //   })
      // });
      // const data = await response.json();
      // setRestaurants(data.results);
      
      toast.success("Restaurant data loaded! (Using sample data - integrate Google Places API for live data)");
    } catch (error) {
      toast.error("Could not fetch restaurant data. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically load restaurants on component mount
    fetchNearbyRestaurants();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "fill-kerala-spice text-kerala-spice" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kerala Restaurants
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Kerala cuisine near you. From traditional sadya meals to coastal seafood specialties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search restaurants, cuisine, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden border-primary/20 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              {/* Restaurant Image */}
              <div className="h-48 bg-gradient-kerala flex items-center justify-center">
                {restaurant.image ? (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center text-primary-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Image placeholder</p>
                    <p className="text-xs mt-1">Add image to public/images/</p>
                  </div>
                )}
              </div>

              {/* Restaurant Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {restaurant.name}
                  </h3>
                  <span className="text-sm text-muted-foreground font-medium">
                    {restaurant.priceLevel}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(restaurant.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    {restaurant.rating}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {restaurant.description}
                </p>

                {/* Address */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {restaurant.address}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {restaurant.hours}
                  </span>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => openInGoogleMaps(restaurant)}
                  className="w-full bg-gradient-primary shadow-soft hover:shadow-card transition-all"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Google Maps
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all available restaurants.
            </p>
          </div>
        )}

        {/* Developer Instructions */}
        <Card className="mt-8 p-6 border-kerala-spice/30 bg-kerala-spice/5">
          <h3 className="font-semibold text-foreground mb-3">Developer Setup Instructions:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>1. Google Places API:</strong> Get an API key from Google Cloud Console and enable Places API</p>
            <p><strong>2. Backend Integration:</strong> Create an API endpoint to fetch restaurants using Google Places API</p>
            <p><strong>3. Images:</strong> Add restaurant images to the <code>public/images/</code> folder</p>
            <p><strong>4. Location:</strong> Implement geolocation to find restaurants near user's current location</p>
            <p><strong>5. Filtering:</strong> Add filters for cuisine type, price range, and ratings</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Restaurants;