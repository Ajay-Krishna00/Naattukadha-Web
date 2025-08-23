"use client";
import { useState } from "react";
import { MapPin, Lock, Award, Calendar, Camera, Star, Trophy, Heart, Users, Navigation } from "lucide-react";

const stampsData = [
  {
    id: 1,
    name: "Backwaters Explorer",
    location: "Alleppey",
    img: "/stamps/backwaters.png",
    unlocked: true,
    unlockedDate: "March 15, 2024",
    description: "Cruised through the serene backwaters",
    rarity: "common"
  },
  {
    id: 2,
    name: "Kathakali Enthusiast",
    location: "Kochi",
    img: "/stamps/kathakali.png",
    unlocked: false,
    description: "Witness the art of Kathakali dance",
    rarity: "rare"
  },
  {
    id: 3,
    name: "Hillstation Hiker",
    location: "Munnar",
    img: "/stamps/munnar.png",
    unlocked: true,
    unlockedDate: "January 8, 2024",
    description: "Conquered the tea garden trails",
    rarity: "uncommon"
  },
  {
    id: 4,
    name: "Temple Trail",
    location: "Guruvayur",
    img: "/stamps/temple.png",
    unlocked: true,
    unlockedDate: "December 22, 2023",
    description: "Blessed at the sacred temple",
    rarity: "common"
  },
  {
    id: 5,
    name: "Spice Route Master",
    location: "Thekkady",
    img: "/stamps/spices.png",
    unlocked: false,
    description: "Discover the aromatic spice plantations",
    rarity: "legendary"
  },
  {
    id: 6,
    name: "Beach Wanderer",
    location: "Kovalam",
    img: "/stamps/beach.png",
    unlocked: true,
    unlockedDate: "February 5, 2024",
    description: "Relaxed on golden sands",
    rarity: "common"
  },
  {
    id: 7,
    name: "Wildlife Photographer",
    location: "Periyar",
    img: "/stamps/wildlife.png",
    unlocked: false,
    description: "Capture Kerala's wild beauty",
    rarity: "epic"
  },
  {
    id: 8,
    name: "Ayurveda Seeker",
    location: "Varkala",
    img: "/stamps/ayurveda.png",
    unlocked: false,
    description: "Experience ancient healing arts",
    rarity: "rare"
  }
];

const getRarityColor = (rarity) => {
  switch(rarity) {
    case 'common': return 'text-emerald-600 bg-emerald-100';
    case 'uncommon': return 'text-blue-600 bg-blue-100';
    case 'rare': return 'text-purple-600 bg-purple-100';
    case 'epic': return 'text-orange-600 bg-orange-100';
    case 'legendary': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default function ProfilePage() {
  const [user] = useState({
    name: "Keira Madeline Victor",
    email: "keira@example.com",
    avatar: "/avatar.png",
    joinDate: "October 2023",
    totalStamps: stampsData.filter(s => s.unlocked).length,
    placesVisited: 12,
    favoriteLocation: "Munnar"
  });

  const [selectedStamp, setSelectedStamp] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredStamps = stampsData.filter(stamp => {
    if (activeTab === 'unlocked') return stamp.unlocked;
    if (activeTab === 'locked') return !stamp.unlocked;
    return true;
  });

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Profile Header */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 mb-8 border border-emerald-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <img
                  // src={user.avatar}
                  // alt="avatar"
                  className="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-emerald-700 text-lg mb-4">{user.email}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-emerald-800">{user.totalStamps}</div>
                    <div className="text-sm text-emerald-600">Stamps</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <MapPin className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-green-800">{user.placesVisited}</div>
                    <div className="text-sm text-green-600">Places</div>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-3">
                    <Heart className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-teal-800">{user.favoriteLocation}</div>
                    <div className="text-sm text-teal-600">Favorite</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-800">{user.joinDate}</div>
                    <div className="text-sm text-blue-600">Joined</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy Section */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-emerald-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-emerald-800">
                <Award className="w-8 h-8" /> 
                Kerala Legacy Collection
              </h2>
              <div className="flex gap-2">
                {['all', 'unlocked', 'locked'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStamps.map((stamp) => (
                <div
                  key={stamp.id}
                  onClick={() => setSelectedStamp(stamp)}
                  className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    stamp.unlocked 
                      ? "bg-gradient-to-br from-white to-emerald-50 shadow-lg hover:shadow-2xl" 
                      : "bg-gradient-to-br from-gray-50 to-gray-100 opacity-70"
                  } rounded-2xl p-6 border-2 ${
                    stamp.unlocked ? "border-emerald-200 hover:border-emerald-300" : "border-gray-200"
                  }`}
                >
                  {/* Rarity Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(stamp.rarity)}`}>
                    {stamp.rarity}
                  </div>

                  {/* Stamp Image */}
                  <div className="flex justify-center mb-4">
                    <div className={`relative w-20 h-20 rounded-xl overflow-hidden ${
                      stamp.unlocked ? "shadow-md" : ""
                    }`}>
                      <img
                        src="/badge.png"
                        // alt={stamp.name}
                        className={`w-full h-full object-contain ${
                          !stamp.unlocked ? "grayscale opacity-50" : ""
                        }`}
                      />
                      {stamp.unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                      )}
                    </div>
                  </div>

                  {/* Stamp Info */}
                  <h3 className={`text-lg font-bold text-center mb-2 ${
                    stamp.unlocked ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {stamp.name}
                  </h3>
                  
                  <div className={`flex items-center justify-center gap-1 mb-2 ${
                    stamp.unlocked ? "text-emerald-600" : "text-gray-400"
                  }`}>
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{stamp.location}</span>
                  </div>

                  <p className={`text-xs text-center ${
                    stamp.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {stamp.description}
                  </p>

                  {stamp.unlocked && stamp.unlockedDate && (
                    <div className="mt-3 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        <Calendar className="w-3 h-3" />
                        {stamp.unlockedDate}
                      </span>
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {!stamp.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl">
                      <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* Glow Effect for Unlocked Stamps */}
                  {stamp.unlocked && (
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 bg-emerald-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-emerald-800 font-semibold">Collection Progress</span>
                <span className="text-emerald-600 font-bold">
                  {user.totalStamps}/{stampsData.length} Stamps
                </span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${(user.totalStamps / stampsData.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-emerald-700 text-sm mt-2 text-center">
                Keep exploring Kerala to unlock more stamps! 🌴
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stamp Detail Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/badge.png"
                  // alt={selectedStamp.name}
                  className={`w-full h-full object-contain ${
                    !selectedStamp.unlocked ? "grayscale opacity-20" : ""
                  }`}
                />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedStamp.name}</h3>
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{selectedStamp.location}</span>
              </div>
              
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRarityColor(selectedStamp.rarity)}`}>
                {selectedStamp.rarity.charAt(0).toUpperCase() + selectedStamp.rarity.slice(1)}
              </div>
              
              <p className="text-gray-600 mb-6">{selectedStamp.description}</p>
              
              {selectedStamp.unlocked && selectedStamp.unlockedDate && (
                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Unlocked on {selectedStamp.unlockedDate}</span>
                  </div>
                </div>
              )}
              
              {!selectedStamp.unlocked && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Navigation className="w-5 h-5" />
                    <span>Visit {selectedStamp.location} to unlock this stamp!</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setSelectedStamp(null)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}