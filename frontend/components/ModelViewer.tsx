'use client'; // Add this line to make it a client component

import React from "react";

const ModelViewer = ({ imagePath }: { imagePath: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <img
        src={imagePath}
        alt="Model"
        className="w-auto max-w-full h-auto max-h-full object-contain rounded-3xl shadow-lg shadow-[rgba(8,148,255,0.3)]"
        style={{
          filter: "drop-shadow(0 4px 20px rgba(72, 61, 139, 0.5))",
        }}
      />
    </div>
  );
};

export default ModelViewer;
