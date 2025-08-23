"use client";
import { useState, useEffect} from "react";
import { MapPin, ExternalLink, Search, Star, Clock } from "lucide-react";

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

  // Simple toast notification function
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-md text-white transition-opacity duration-300 ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open Google Maps
  const openInGoogleMaps = (restaurant) => {
    // Option 1: Using coordinates
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}&query_place_id=${restaurant.googlePlaceId}`;
    
    // Option 2: Using place name and address (fallback)
    // const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`;
    
    window.open(mapsUrl, "_blank");
    showToast(`Opening ${restaurant.name} in Google Maps`, "success");
  };

  // Function to integrate with Google Places API (to be implemented)
  const fetchNearbyRestaurants = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement Google Places API integration
      showToast("Restaurant data loaded! (Using sample data - integrate Google Places API for live data)", "success");
    } catch (error) {
      showToast("Could not fetch restaurant data. Please check your internet connection.", "error");
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
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kerala Restaurants
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover authentic Kerala cuisine near you. From traditional sadya meals to coastal seafood specialties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search restaurants, cuisine, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Restaurant Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
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
                  <div className="text-center text-white">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Image placeholder</p>
                    <p className="text-xs mt-1 opacity-75">Add image to public/images/</p>
                  </div>
                )}
              </div>

              {/* Restaurant Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                    {restaurant.priceLevel}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(restaurant.rating)}</div>
                  <span className="text-sm text-gray-600 font-medium">
                    {restaurant.rating}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {restaurant.description}
                </p>

                {/* Address */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {restaurant.address}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {restaurant.hours}
                  </span>
                </div>

                {/* Actions */}
                <button
                  onClick={() => openInGoogleMaps(restaurant)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Google Maps
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all available restaurants.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        )}

        {/* Developer Instructions */}
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Developer Setup Instructions:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p><strong>1. Google Places API:</strong> Get an API key from Google Cloud Console and enable Places API</p>
              <p><strong>2. Backend Integration:</strong> Create an API endpoint to fetch restaurants using Google Places API</p>
              <p><strong>3. Images:</strong> Add restaurant images to the <code className="bg-white px-2 py-1 rounded">public/images/</code> folder</p>
            </div>
            <div className="space-y-2">
              <p><strong>4. Location:</strong> Implement geolocation to find restaurants near user's current location</p>
              <p><strong>5. Filtering:</strong> Add filters for cuisine type, price range, and ratings</p>
              <p><strong>6. Styling:</strong> This component uses only Tailwind CSS - no shadcn dependencies!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;