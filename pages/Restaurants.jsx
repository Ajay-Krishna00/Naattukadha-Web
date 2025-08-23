"use client";
import { useState, useEffect} from "react";
import { MapPin, ExternalLink, Search, Star, Clock } from "lucide-react";

const sampleRestaurants =[];

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

  useEffect(() => {
  fetchNearbyRestaurants();
}, []);


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

const fetchNearbyRestaurants = async (lat = null, lng = null) => {
    setIsLoading(true);
    
    try {
      let userLat = lat;
      let userLng = lng;
      
      // Get user's current location if not provided
      if (!userLat || !userLng) {
        // Check if geolocation is available and if we're on HTTPS
        if (navigator.geolocation && (location.protocol === 'https:' || location.hostname === 'localhost')) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: false, // Use less accurate but faster positioning
                maximumAge: 300000 // 5 minutes cache
              });
            });
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            showToast("Found your location! Loading nearby restaurants.", "success");
          } catch (geoError) {
            console.warn("Geolocation failed:", geoError.message);
            // Fallback to Kothamangalam, Kerala coordinates (user's actual location)
            userLat = 10.0527;
            userLng = 76.6350;
            showToast("Using Kothamangalam, Kerala as default location.", "info");
          }
        } else {
          // Fallback to Kothamangalam, Kerala coordinates
          userLat = 10.0527;
          userLng = 76.6350;
          if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            showToast("Location requires HTTPS. Showing restaurants near Kothamangalam, Kerala.", "info");
          } else {
            showToast("Location access not available. Showing restaurants near Kothamangalam, Kerala.", "info");
          }
        }
      }
      // Search radius in meters (5km)
      const radius = 5000;
      
      // Overpass API query to find restaurants near user location
      const overpassQuery = `
        [out:json][timeout:25];
        (
          nwr["amenity"="restaurant"]["cuisine"~"indian|kerala|south_indian"](around:${radius},${userLat},${userLng});
          nwr["amenity"="restaurant"]["name"~"kerala|spice|curry|coconut|backwater|traditional"](around:${radius},${userLat},${userLng});
        );
        out center meta;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant data');
      }

      const data = await response.json();
      
      // Process and format the restaurant data
      const fetchedRestaurants = data.elements
        .filter(restaurant => restaurant.tags && restaurant.tags.name)
        .slice(0, 10) // Limit to 10 restaurants
        .map((restaurant, index) => {
          const tags = restaurant.tags;
          
          // Calculate distance from user location
          const distance = calculateDistance(
            userLat, userLng,
            restaurant.lat || restaurant.center?.lat,
            restaurant.lon || restaurant.center?.lon
          );

          return {
            id: restaurant.id.toString(),
            name: tags.name || `Restaurant ${index + 1}`,
            description: generateDescription(tags),
            image: null, // OSM doesn't provide images
            rating: generateRating(), // Generate realistic rating
            priceLevel: tags.price_level || generatePriceLevel(tags),
            address: formatAddress(tags),
            phone: tags.phone || tags["contact:phone"] || "Phone not available",
            hours: formatHours(tags.opening_hours),
            osmId: restaurant.id,
            lat: restaurant.lat || restaurant.center?.lat,
            lng: restaurant.lon || restaurant.center?.lon,
            distance: distance,
            cuisine: tags.cuisine || "Indian"
          };
        });

      // Sort by distance
      fetchedRestaurants.sort((a, b) => a.distance - b.distance);

      if (fetchedRestaurants.length > 0) {
        setRestaurants(fetchedRestaurants);
        showToast(`Found ${fetchedRestaurants.length} Kerala restaurants near you!`, "success");
      } else {
        // Fallback to sample data if no restaurants found
        setRestaurants(sampleRestaurants);
        showToast("No Kerala restaurants found nearby. Showing sample restaurants.", "info");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants(sampleRestaurants);
      showToast("Could not fetch live restaurant data. Showing sample restaurants.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Helper function to generate description based on OSM tags
  const generateDescription = (tags) => {
    const cuisine = tags.cuisine || "Indian";
    const name = tags.name || "Restaurant";
    
    const descriptions = [
      `Authentic ${cuisine} cuisine featuring traditional Kerala flavors and spices.`,
      `Local favorite serving delicious ${cuisine} dishes with fresh ingredients.`,
      `Traditional restaurant specializing in Kerala and South Indian delicacies.`,
      `Family-friendly dining experience with authentic ${cuisine} food.`,
      `Popular local spot known for its flavorful ${cuisine} dishes.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  // Helper function to generate realistic ratings
  const generateRating = () => {
    return (3.5 + Math.random() * 1.5).toFixed(1);
  };

  // Helper function to generate price level
  const generatePriceLevel = (tags) => {
    if (tags.cuisine && tags.cuisine.includes("fine_dining")) return "$$$";
    if (tags.amenity === "fast_food") return "$";
    return "$$";
  };

  // Helper function to format address
  const formatAddress = (tags) => {
    const parts = [];
    if (tags["addr:street"]) parts.push(tags["addr:street"]);
    if (tags["addr:city"]) parts.push(tags["addr:city"]);
    if (tags["addr:state"]) parts.push(tags["addr:state"]);
    
    if (parts.length > 0) {
      return parts.join(", ");
    }
    
    return "Kerala, India";
  };

  // Helper function to format opening hours
  const formatHours = (hours) => {
    if (!hours) return "Hours not available";
    if (hours === "24/7") return "Open 24 hours";
    return hours;
  };

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
      </div>
    </div>
  );
};

export default Restaurants;