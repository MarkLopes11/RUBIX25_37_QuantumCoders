//this file has image slideshow
"use client"
import React, { useState, useEffect } from "react";
import ModelViewer from "@/components/ModelViewer"; // Import the ModelViewer component
import { Meteors } from "@/components/ui/meteors"; // Import the Meteors component

const Features = () => {
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
    <section id="features" className="py-20 relative overflow-hidden text-center bg-black">
      {/* Meteor background effect */}
      <Meteors number={30} className="absolute inset-0 z-10" />

      <div className="w-full h-[500px] lg:h-[700px] mb-12 relative z-20">
        {/* Render the Image Viewer with the current image */}
        <ModelViewer imagePath={imagePaths[currentIndex]} />
      </div>

      {/* Project Description */}
      <div className="text-center relative z-20 mt-8 px-6">
        <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 font-medium mb-4">
          Our project leverages cutting-edge technology to revolutionize the way people interact with AI-driven solutions. With a focus on innovation, we aim to provide users with intelligent tools that enhance productivity and creativity.
        </p>
        <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          From seamless integrations to an intuitive user experience, our project is designed to cater to diverse needs while ensuring ease of use. Join us in shaping the future!
        </p>
      </div>
    </section>
  );
};

export default Features;
