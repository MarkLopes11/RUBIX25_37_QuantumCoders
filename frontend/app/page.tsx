import React from "react";
import { Inter } from "next/font/google";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import GlowingLineBreaker from "@/components/ui/GlowingLineBreaker"; // Import the GlowingLineBreaker component
//import AnimatedBackground from "@/app/FashionAIHelper/AnimatedBackground";
//import FashionAIHelper from "@/app/FashionAIHelper/FashionAIHelper";
const inter = Inter({ subsets: ["latin"] });

const HomePage = () => {
  return (
    <main className={`${inter.className} bg-n-8 text-n-1`}>
      <HeroSection />
      <Features />
      <GlowingLineBreaker /> {/* Glowing Line Breaker after Features */}
      <Services />
      <GlowingLineBreaker /> {/* Glowing Line Breaker after Services */}
      <Pricing />
      <GlowingLineBreaker /> {/* Glowing Line Breaker after Roadmap */}
    </main>
  );
};

export default HomePage;
