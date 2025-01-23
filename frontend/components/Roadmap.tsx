import React from "react";
import { Calendar } from "lucide-react";

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20 bg-n-6 text-center">
      <h2 className="text-3xl font-semibold text-n-1 mb-8">Our Roadmap</h2>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-12">
          <div className="flex items-center gap-4 justify-center">
            <Calendar className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-n-1">Q1 2025</h3>
          </div>
          <ul className="text-left text-n-3">
            <li>Release basic wardrobe management features</li>
            <li>Integrate AI-powered outfit suggestions</li>
          </ul>
        </div>
        <div className="space-y-12 mt-12">
          <div className="flex items-center gap-4 justify-center">
            <Calendar className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-n-1">Q2 2025</h3>
          </div>
          <ul className="text-left text-n-3">
            <li>Launch shopping integration with top stores</li>
            <li>Enhance personalized recommendations</li>
          </ul>
        </div>
        <div className="space-y-12 mt-12">
          <div className="flex items-center gap-4 justify-center">
            <Calendar className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-n-1">Q3 2025</h3>
          </div>
          <ul className="text-left text-n-3">
            <li>Expand wardrobe management to include seasonal trends</li>
            <li>Integrate advanced AI features for real-time fashion recommendations</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
