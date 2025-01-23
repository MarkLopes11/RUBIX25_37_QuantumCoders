import React from "react";

const GlowingLineBreaker: React.FC = () => {
  return (
    <div className="relative py-10 bg-[#000000]">
      <div className="glowing-line-container flex justify-center">
        <div className="glowing-line w-3/4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse rounded-full" />
      </div>
    </div>
  );
};

export default GlowingLineBreaker;
