"use client";
import { useState, useEffect} from "react";
import { MapPin, ExternalLink, Search, Star, Clock } from "lucide-react";

const sampleRestaurants = [
  {
    id: "sample-1",
    name: "Kerala Kitchen",
    description: "Authentic Kerala cuisine featuring traditional flavors and spices.",
    image: null,
    rating: "4.2",
    priceLevel: "$$",
    address: "Kothamangalam, Kerala, India",
    phone: "Phone not available",
    hours: "9:00 AM - 10:00 PM",
    lat: 10.0527,
    lng: 76.6350,
    distance: 0.5,
    cuisine: "Kerala"
  },
  {
    id: "sample-2",
    name: "Spice Garden Restaurant",
    description: "Local favorite serving delicious South Indian dishes with fresh ingredients.",
    image: null,
    rating: "4.0",
    priceLevel: "$$",
    address: "Muvattupuzha, Kerala, India",
    phone: "Phone not available",
    hours: "8:00 AM - 9:00 PM",
    lat: 10.0889,
    lng: 76.5742,
    distance: 1.2,
    cuisine: "South Indian"
  }
];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [originalRestaurants, setOriginalRestaurants] = useState(sampleRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

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
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open Google Maps
  const openInGoogleMaps = (restaurant) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;
    window.open(mapsUrl, "_blank");
    //showToast(`Opening ${restaurant.name} in Google Maps`, "success");
  };

  // Function to geocode location using Nominatim
  const geocodeLocation = async (locationQuery) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchNearbyRestaurants = async (lat = null, lng = null, locationName = null) => {
    setIsLoading(true);
    
    try {
      let userLat = lat;
      let userLng = lng;
      let locationDisplayName = locationName;
      
      // Get user's current location if not provided
      if (!userLat || !userLng) {
        if (searchLocation.trim()) {
          // Try to geocode the search location first
          const geocoded = await geocodeLocation(searchLocation.trim());
          if (geocoded) {
            userLat = geocoded.lat;
            userLng = geocoded.lng;
            locationDisplayName = geocoded.displayName;
            //showToast(`Found location: ${searchLocation}`, "success");
          } else {
            //showToast(`Could not find location: ${searchLocation}. Using current location.`, "error");
          }
        }
        
        // If still no coordinates, try geolocation or fallback
        if (!userLat || !userLng) {
          if (navigator.geolocation && (location.protocol === 'https:' || location.hostname === 'localhost')) {
            try {
              const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  timeout: 10000,
                  enableHighAccuracy: false,
                  maximumAge: 300000
                });
              });
              userLat = position.coords.latitude;
              userLng = position.coords.longitude;
              //showToast("Using your current location!", "success");
            } catch (geoError) {
              console.warn("Geolocation failed:", geoError.message);
              userLat = 10.0527;
              userLng = 76.6350;
             // showToast("Using Kothamangalam, Kerala as default location.", "info");
            }
          } else {
            userLat = 10.0527;
            userLng = 76.6350;
            //showToast("Using Kothamangalam, Kerala as default location.", "info");
          }
        }
      }

      // Search radius in meters (10km for better results)
      const radius = 10000;
      
      // Enhanced Overpass API query
      const overpassQuery = `
        [out:json][timeout:25];
        (
          nwr["amenity"="restaurant"](around:${radius},${userLat},${userLng});
          nwr["amenity"="cafe"](around:${radius},${userLat},${userLng});
          nwr["amenity"="fast_food"](around:${radius},${userLat},${userLng});
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
        .slice(0, 20) // Increased limit
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
            image: null,
            rating: generateRating(),
            priceLevel: generatePriceLevel(tags),
            address: formatAddress(tags),
            phone: tags.phone || tags["contact:phone"] || "Phone not available",
            hours: formatHours(tags.opening_hours),
            osmId: restaurant.id,
            lat: restaurant.lat || restaurant.center?.lat,
            lng: restaurant.lon || restaurant.center?.lon,
            distance: distance,
            cuisine: tags.cuisine || determineCuisineFromName(tags.name) || "Restaurant"
          };
        });

      // Sort by distance
      fetchedRestaurants.sort((a, b) => a.distance - b.distance);

      if (fetchedRestaurants.length > 0) {
        setRestaurants(fetchedRestaurants);
        setOriginalRestaurants(fetchedRestaurants);
        const locationText = locationDisplayName || searchLocation || "your location";
        //showToast(`Found ${fetchedRestaurants.length} restaurants near ${locationText}!`, "success");
      } else {
        setRestaurants(sampleRestaurants);
        setOriginalRestaurants(sampleRestaurants);
        //showToast("No restaurants found nearby. Showing sample restaurants.", "info");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants(sampleRestaurants);
      setOriginalRestaurants(sampleRestaurants);
     // showToast("Could not fetch live restaurant data. Showing sample restaurants.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine cuisine from restaurant name
  const determineCuisineFromName = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('kerala') || nameLower.includes('sadya')) return 'Kerala';
    if (nameLower.includes('pizza')) return 'Italian';
    if (nameLower.includes('burger') || nameLower.includes('kfc') || nameLower.includes('mcdonald')) return 'Fast Food';
    if (nameLower.includes('chinese') || nameLower.includes('dragon')) return 'Chinese';
    if (nameLower.includes('biriyani') || nameLower.includes('biryani')) return 'Indian';
    if (nameLower.includes('cafe') || nameLower.includes('coffee')) return 'Cafe';
    return 'Restaurant';
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Helper function to generate description based on OSM tags
  const generateDescription = (tags) => {
    const cuisine = tags.cuisine || "local";
    const amenity = tags.amenity || "restaurant";
    
    const descriptions = [
      `Popular ${amenity} serving delicious ${cuisine} dishes with fresh ingredients.`,
      `Local favorite specializing in ${cuisine} cuisine and traditional flavors.`,
      `Family-friendly ${amenity} known for its authentic ${cuisine} food.`,
      `Cozy ${amenity} offering a variety of ${cuisine} specialties.`,
      `Well-known ${amenity} with excellent ${cuisine} dishes and good service.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  // Helper function to generate realistic ratings
  const generateRating = () => {
    return (3.5 + Math.random() * 1.5).toFixed(1);
  };

  // Helper function to generate price level
  const generatePriceLevel = (tags) => {
    if (tags.amenity === "fast_food") return "$";
    if (tags.cuisine && (tags.cuisine.includes("fine_dining") || tags.cuisine.includes("french"))) return "$$$";
    return "$$";
  };

  // Helper function to format address
  const formatAddress = (tags) => {
    const parts = [];
    if (tags["addr:street"]) parts.push(tags["addr:street"]);
    if (tags["addr:city"]) parts.push(tags["addr:city"]);
    if (tags["addr:state"]) parts.push(tags["addr:state"]);
    if (tags["addr:country"]) parts.push(tags["addr:country"]);
    
    if (parts.length > 0) {
      return parts.join(", ");
    }
    
    return "Address not available";
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

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim() && !searchLocation.trim()) {
      // Reset to original restaurants if both searches are empty
      setRestaurants(originalRestaurants);
      return;
    }
    
    if (searchLocation.trim()) {
      // Search by location - fetch new restaurants
      fetchNearbyRestaurants();
    } else if (searchQuery.trim()) {
      // Filter existing restaurants by name/cuisine
      const filtered = originalRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setRestaurants(filtered);
      
      if (filtered.length > 0) {
        //showToast(`Found ${filtered.length} restaurants matching "${searchQuery}"`, "success");
      } else {
        //showToast(`No restaurants found matching "${searchQuery}"`, "info");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Finder
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover great restaurants near you. Search by name, cuisine, or location.
          </p>
        </div>

        {/* Search Bars */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div>
            {/* Location Search */}
            <div className="relative mb-4">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Enter location (city, area, address)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Restaurant/Cuisine Search */}
            {/* <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search restaurants, cuisine type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}
            
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Search Restaurants
            </button>
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
                <div className="text-center text-white">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">{restaurant.cuisine}</p>
                  <p className="text-xs mt-1 opacity-75">{restaurant.distance?.toFixed(1)} km away</p>
                </div>
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
        {filteredRestaurants.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">
              Try searching for a different location or restaurant type.
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