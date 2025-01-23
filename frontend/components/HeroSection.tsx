import React from "react";
import Link from "next/link";
import { Meteors } from "@/components/ui/meteors"; // Import Meteors component

const HeroSection = () => {
  return (
    <section className="flex justify-center items-center bg-black py-20 relative">
      <Meteors number={30} className="absolute inset-0 z-0" /> {/* Add meteors effect */}
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">AI Fashion Wardrobe Assistant</h1>
        <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-8">Smart suggestions and wardrobe management, all in one place!</p>
        <Link href="/FashionAIHelper">
          <button className="bg-[#4E81FF] text-white py-2 px-6 rounded-full hover:bg-[#FF90D0] transition">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
