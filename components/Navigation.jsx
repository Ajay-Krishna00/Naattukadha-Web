// "use client";
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X, Camera, MapPin, Music } from "lucide-react";

// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   const navItems = [
//     { path: "/ar", label: "AR Experiences", icon: Camera },
//     { path: "/restaurants", label: "Restaurants", icon: MapPin },
//     { path: "/music", label: "Folk Music", icon: Music },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-nav">
//       <div className="container mx-auto px-4 sm:px-6">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-xl font-bold text-primary hover:text-primary-dark transition-colors"
//           >
//             Nattukaadha AR
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navItems.map(({ path, label, icon: Icon }) => (
//               <Link key={path} to={path}>
//                 <Button
//                   variant={isActive(path) ? "default" : "ghost"}
//                   className={`flex items-center gap-2 ${
//                     isActive(path)
//                       ? "bg-gradient-primary text-primary-foreground shadow-soft"
//                       : "text-foreground hover:text-primary hover:bg-accent/50"
//                   }`}
//                 >
//                   <Icon className="h-4 w-4" />
//                   {label}
//                 </Button>
//               </Link>
//             ))}
//           </div>

//           {/* Mobile Menu Button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="md:hidden"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </Button>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden py-4 border-t border-primary/20">
//             <div className="flex flex-col space-y-2">
//               {navItems.map(({ path, label, icon: Icon }) => (
//                 <Link key={path} to={path} onClick={() => setIsOpen(false)}>
//                   <Button
//                     variant={isActive(path) ? "default" : "ghost"}
//                     className={`w-full justify-start gap-2 ${
//                       isActive(path)
//                         ? "bg-gradient-primary text-primary-foreground"
//                         : "text-foreground hover:text-primary hover:bg-accent/50"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                     {label}
//                   </Button>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;

"use client";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Camera, MapPin, Music } from "lucide-react";

// Custom Button Component
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 active:scale-95",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-green-600"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2"
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
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/ar", label: "AR Experiences", icon: Camera },
    { path: "/restaurants", label: "Restaurants", icon: MapPin },
    { path: "/music", label: "Folk Music", icon: Music },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-200 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Nattukaadha AR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
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
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-green-200">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsOpen(false)}>
                  <div
                    className={`w-full flex items-center justify-start gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(path)
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </div>
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