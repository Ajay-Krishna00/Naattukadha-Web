import React from 'react';
import { Menu, X, ArrowRight, Play, MapPin, Music, Utensils, Palette } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % bgimages.length);
  }, 3000); // Change slide every 3 seconds
  return () => clearInterval(interval);
}, []);


  const bgimages = [
  {
    src: "kathakali.jpg",
  },
  {
    src: "houseboat.jpg",
  },
  {
    src: "temple.jpg",
  },
  {
    src: "padyani.jpg",
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
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

            {/* Desktop Navigation */}
            <div >
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium">
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
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
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold text-green-900 leading-tight">
                  Discover Kerala's
                  <span className="block text-green-700">Cultural Heritage</span>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                  Experience the rich traditions, taste authentic flavors, and listen to timeless melodies of God's Own Country through immersive AR and curated content.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden shadow-2xl">
                 <img
                   src={bgimages[currentIndex].src}
                    className="w-full h-96 lg:h-[500px] object-cover transition-all duration-700"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;