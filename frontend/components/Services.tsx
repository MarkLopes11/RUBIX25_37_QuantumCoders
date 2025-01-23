import React from "react";
import { Heart, Cloud, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Adjust the import path as necessary
import { Meteors } from "@/components/ui/meteors"; // Import the Meteors component

const Services = () => {
  return (
    <section id="services" className="py-20 text-center relative bg-black">
      {/* Meteor Background Effect */}
      <Meteors number={30} className="absolute inset-0 z-10" />

      <h2 className="text-3xl font-semibold text-white mb-8 relative z-20">Our Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 lg:px-16 relative z-20">
        {/* Personalized Styling Service */}
        <Card className="bg-gradient-to-r from-[#0894FF] to-[#C959DD] p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center mb-4 text-white">
              <Heart className="text-white mr-2" size={36} />
              Personalized Styling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white">
              AI-driven recommendations based on your wardrobe and preferences for the perfect look.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Cloud-Based Wardrobe Service */}
        <Card className="bg-gradient-to-r from-[#4E81FF] to-[#FF90D0] p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center mb-4 text-white">
              <Cloud className="text-white mr-2" size={36} />
              Cloud-Based Wardrobe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white">
              Access and manage your wardrobe from anywhere, anytime with cloud storage.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Shop Your Style Service */}
        <Card className="bg-gradient-to-r from-[#FF2E54] to-[#FF9004] p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center mb-4 text-white">
              <ShoppingBag className="text-white mr-2" size={36} />
              Shop Your Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white">
              Seamlessly integrate with stores to shop for new items matching your style and wardrobe.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Services;
