"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGetStarted = (e:React.MouseEvent) => {
    if (!isMounted) return;
    
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      router.push('/FashionAIHelper');
    }, 1500);
  };

  const LoadingAnimation = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-transparent border-t-[#4E81FF] border-r-[#FF90D0] rounded-full animate-spin"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 animate-pulse rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
        Drip
        </div>
      </div>
      <p className="mt-4 text-white text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        Loading your AI Fashion Assistant...
      </p>
    </div>
  );

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <section className="flex justify-center items-center bg-black py-20 relative">
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">
          AI Fashion Wardrobe Assistant
        </h1>
        <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-8">
          Smart suggestions and wardrobe management, all in one place!
        </p>
        <button 
          onClick={handleGetStarted}
          className="bg-[#4E81FF] text-white py-2 px-6 rounded-full hover:bg-[#FF90D0] transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;