import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Import the Card component
import { Meteors } from "@/components/ui/meteors"; // Import the Meteors component

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 text-center relative bg-black">
      {/* Meteor Background Effect */}
      <Meteors number={30} className="absolute inset-0 z-10" />

      <h2 className="text-3xl font-semibold text-white mb-8 relative z-20">Pricing</h2>
      <div className="flex justify-center gap-8 px-4 sm:px-8 lg:px-16 relative z-20">
        {/* Basic Plan Card */}
        <Card className="bg-gradient-to-r from-[#0894FF] to-[#C959DD] w-64 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="text-white text-center">Basic Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-white">Free</p>
            <ul className="text-left mb-4 text-white">
              <li>Access to basic wardrobe management</li>
              <li>Limited styling recommendations</li>
            </ul>
            <button className="bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark transition">
              Get Started
            </button>
          </CardContent>
        </Card>

        {/* Pro Plan Card */}
        <Card className="bg-gradient-to-r from-[#4E81FF] to-[#FF90D0] w-64 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="text-white text-center">Pro Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4 text-white">$9.99/month</p>
            <ul className="text-left mb-4 text-white">
              <li>Advanced AI styling</li>
              <li>Cloud storage integration</li>
              <li>Unlimited wardrobe items</li>
            </ul>
            <button className="bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark transition">
              Subscribe Now
            </button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
