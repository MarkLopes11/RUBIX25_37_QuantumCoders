'use client';
import { SignIn } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { Meteors } from "@/components/ui/meteors"; // Import the Meteors component
import ModelViewer from "@/components/ModelViewer"; // Import the ModelViewer component

export default function Page() {
  // List of images for the slideshow
  const imagePaths = [
    "/images/virat.png",
    "/images/sara.jpg",
    "/images/rahul.webp",
    "/images/rashmika.jpg",
    "/images/pandhya.jpg"
  ];

  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change the image every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    }, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [imagePaths.length]);

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 relative">
        
        {/* Meteor Effect Component */}
        <Meteors />
        
        <section className="relative flex items-end lg:col-span-5 xl:col-span-6 bg-gradient-to-r from-black via-black/70 to-transparent">
          <div className="lg:relative lg:block lg:p-12 flex flex-col justify-between h-full w-full">
            {/* Image slideshow and project description */}
            <section id="features" className="py-20 relative overflow-hidden text-center ">
              {/* Meteor background effect */}
              <Meteors number={30} className="absolute inset-0 z-10" />

              <div className="w-full h-[500px] lg:h-[700px] mb-12 relative z-20">
                {/* Render the Image Viewer with the current image */}
                <ModelViewer imagePath={imagePaths[currentIndex]} />
              </div>

              {/* Project Description */}
              <div className="text-center relative z-20 mt-8 px-6">
                <p className="text-xl text-orange-400 font-medium mb-4">
                  Our project leverages cutting-edge technology to revolutionize the way people interact with AI-driven solutions. With a focus on innovation, we aim to provide users with intelligent tools that enhance productivity and creativity.
                </p>
                <p className="text-lg text-orange-400">
                  From seamless integrations to an intuitive user experience, our project is designed to cater to diverse needs while ensuring ease of use. Join us in shaping the future!
                </p>
              </div>
            </section>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl w-full p-8 bg-white rounded-xl">
            {/* SignIn component with increased box area */}
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
