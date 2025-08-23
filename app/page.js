"use client"; // 👈 mark this file as a Client Component

import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import Index from "../pages/Index";
import Restaurants from "../pages/Restaurants";
import FolkMusic from "../pages/FolkMusic";
import Providers from "./providers";
import Profile from "../pages/Profile";
import AR_Experiences from "../pages/AR_Experiences";

export default function App() {
  return (
    <Providers>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/music" element={<FolkMusic />} />
            <Route path="/profile" element={<Profile />}/>
            <Route path="/ar" element={<AR_Experiences />}/>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Providers>
  );
}