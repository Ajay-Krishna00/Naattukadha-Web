"use client";
import { useState, useEffect} from "react";
import { MapPin, ExternalLink, Search, Star, Clock } from "lucide-react";


const restaurantImages = [
  "/appam.jpg",
  "/fish.jpg",
  "/fishcurry.jpg",
  "/fishfry.jpg",
  "/snack.jpg",
  "/rice.jpg",
  "/stew.jpg",
  "/sadhya.jpg",
  "/pearlspot.jpg"
];

const Restaurants = () => {

  const sampleRestaurants = [
  {
    id: "sample-1",
    name: "Kerala Kitchen",
    description: "Authentic Kerala cuisine featuring traditional flavors and spices.",
    image: restaurantImages[0 % restaurantImages.length],
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
    name: "Malayali Mess",
    description: "Traditional Kerala home-style cooking with authentic sadya and fish curry.",
    image: restaurantImages[1 % restaurantImages.length],
    rating: "4.5",
    priceLevel: "$$",
    address: "Muvattupuzha, Kerala, India",
    phone: "Phone not available",
    hours: "8:00 AM - 9:00 PM",
    lat: 10.0889,
    lng: 76.5742,
    distance: 1.2,
    cuisine: "Kerala"
  }
]; 

  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [originalRestaurants, setOriginalRestaurants] = useState(sampleRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // Simple toast notification function
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-md text-white transition-opacity duration-300 ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-green-500"
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

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

  // Helper function to render star ratings
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
              } catch (geoError) {
                console.warn("Geolocation failed:", geoError.message);
               userLat = 10.053937;
userLng = 76.6193309;
              }
            } else {
             userLat = 10.053937;
userLng = 76.6193309;
            }
          }
      }

      // Search radius in meters (15km for better coverage)
      const radius = 15000;
      
      // Focused Overpass API query - ONLY Kerala restaurants
      const overpassQuery = `
        [out:json][timeout:30];
        (
          // Restaurants specifically tagged as Kerala cuisine
          nwr["amenity"="restaurant"]["cuisine"="kerala"](around:${radius},${userLat},${userLng});
          
          // Restaurants with Kerala in their name
          nwr["amenity"="restaurant"]["name"~"Kerala|Malayali|Sadya|Sadhya"](around:${radius},${userLat},${userLng});
          
          // Traditional Kerala restaurant names
          nwr["amenity"="restaurant"]["name"~"Thalassery|Malabar|Kochi|Cochin|Trivandrum|Palakkad"](around:${radius},${userLat},${userLng});
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

            const containsMalayalam = (text) => {
        if (!text) return false;
        // Malayalam Unicode range: U+0D00-U+0D7F
        return /[\u0D00-\u0D7F]/.test(text);
      };

      // Helper function to check if text is primarily English
      const isEnglishText = (text) => {
        if (!text) return false;
        // Check if text contains Malayalam characters
        if (containsMalayalam(text)) return false;
        // Check if text contains mostly Latin characters and common symbols
        return /^[a-zA-Z0-9\s\-'&.,()]+$/.test(text.trim());
      };

      
      // Process and filter STRICTLY for Kerala restaurants only
      const fetchedRestaurants = data.elements
        .filter(r => r.tags && r.tags.name)
        .filter(r => {
          const tags = r.tags;
          const name = tags.name.toLowerCase();
          const cuisine = (tags.cuisine || '').toLowerCase();

           if (!isEnglishText(tags.name)) return false;
          
          // EXCLUDE fast food chains and non-Kerala cuisines
          if (tags.amenity === 'fast_food') return false;
          if (cuisine.includes('arabian') || cuisine.includes('arabic')) return false;
          if (cuisine.includes('chinese') || cuisine.includes('continental')) return false;
          if (cuisine.includes('pizza') || cuisine.includes('burger')) return false;
          if (name.includes('kfc') || name.includes('mcdonald') || name.includes('domino')) return false;
          if (name.includes('pizza') || name.includes('burger')) return false;
          
          // INCLUDE only Kerala-related restaurants
          return (
            cuisine.includes('kerala') ||
            name.includes('kerala') ||
            name.includes('malayali') ||
            name.includes('sadya') ||
            name.includes('sadhya') ||
            name.includes('thalassery') ||
            name.includes('malabar') ||
            name.includes('kochi') ||
            name.includes('cochin') ||
            name.includes('trivandrum') ||
            name.includes('palakkad')
          );
        })
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
            name: tags.name || `Kerala Restaurant ${index + 1}`,
            description: `Authentic Kerala restaurant serving traditional Malayali dishes and local specialties.`,
            image: restaurantImages[index % restaurantImages.length], 
            rating: generateRating(),
            priceLevel: generatePriceLevel(tags),
            address: formatAddress(tags),
            phone: tags.phone || tags["contact:phone"] || "Phone not available",
            hours: formatHours(tags.opening_hours),
            osmId: restaurant.id,
            lat: restaurant.lat || restaurant.center?.lat,
            lng: restaurant.lon || restaurant.center?.lon,
            distance: distance,
            cuisine: "Kerala"
          };
        });

      // Sort by distance and limit to TOP 10 only
      fetchedRestaurants.sort((a, b) => a.distance - b.distance);
      const top10Restaurants = fetchedRestaurants.slice(0, 10);

      if (top10Restaurants.length > 0) {
        setRestaurants(top10Restaurants);
        setOriginalRestaurants(top10Restaurants);
        const locationText = locationDisplayName || searchLocation || "your location";
        console.log(`Found ${top10Restaurants.length} Kerala restaurants near ${locationText}`);
      } else {
        // Fallback to sample Kerala restaurants if none found
        const keralaFallback = sampleRestaurants
          .filter(r => r.cuisine.toLowerCase().includes('kerala'))
          .slice(0, 10);
        
        setRestaurants(keralaFallback.length > 0 ? keralaFallback : sampleRestaurants.slice(0, 10));
        setOriginalRestaurants(keralaFallback.length > 0 ? keralaFallback : sampleRestaurants.slice(0, 10));
        console.log("No Kerala restaurants found nearby. Showing sample restaurants.");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      // Fallback with Kerala-focused sample data
      const keralaFallback = sampleRestaurants
        .filter(r => r.cuisine.toLowerCase().includes('kerala'))
        .slice(0, 10);
      
      setRestaurants(keralaFallback.length > 0 ? keralaFallback : sampleRestaurants.slice(0, 10));
      setOriginalRestaurants(keralaFallback.length > 0 ? keralaFallback : sampleRestaurants.slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  // Updated search handler to maintain Kerala-only focus
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim() && !searchLocation.trim()) {
      // Reset to original Kerala restaurants
      setRestaurants(originalRestaurants);
      return;
    }
    
    if (searchLocation.trim()) {
      // Search by location - fetch new Kerala restaurants only
      fetchNearbyRestaurants();
    } else if (searchQuery.trim()) {
      // Filter existing Kerala restaurants by name
      const filtered = originalRestaurants
        .filter(restaurant =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10); // Keep top 10 even after filtering
      
      setRestaurants(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
          Taste of Kerala
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover authentic Kerala restaurants near you. Search by location to find traditional Malayali cuisine.
          </p>
        </div>

        {/* Search Bars */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 space-y-4">
          <div>
            {/* Location Search */}
            <div className="relative mb-4 ">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Enter location (city, area, address)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200  shadow-sm hover:shadow-md"
            >
              Search Kerala Restaurants
            </button>
          </div>
        </div>

         {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Kerala restaurants...</p>
          </div>
        )}  

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Restaurant Image */}
                <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center overflow-hidden">
                {restaurant.image ? (
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="text-center text-white">
                          <div class="h-12 w-12 mx-auto mb-2">
                            <svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <p class="text-sm font-medium">${restaurant.cuisine}</p>
                          <p class="text-xs mt-1 opacity-75">${restaurant.distance?.toFixed(1)} km away</p>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="text-center text-white">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">{restaurant.cuisine}</p>
                    <p className="text-xs mt-1 opacity-75">{restaurant.distance?.toFixed(1)} km away</p>
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
                  <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {restaurant.address}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {restaurant.hours}
                  </span>
                </div>

                {/* Actions */}
                <button
                  onClick={() => openInGoogleMaps(restaurant)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Kerala restaurants found</h3>
            <p className="text-gray-600">
              Try searching for a different location to find authentic Kerala cuisine.
            </p>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default Restaurants;