"use client";

import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import Providers from "./providers";
import Navigation from "../components/Navigation";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>
          <TooltipProvider>
            <Sonner />
            {/* Show Navigation only if NOT on index page */}
            {pathname !== "/" && <Navigation />}
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
