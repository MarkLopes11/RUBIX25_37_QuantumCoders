"use client"
// app/FashionAIHelper/FashionAIHelper.tsx
import { useState } from "react";
import { Upload } from "lucide-react";

export default function FashionAIHelper() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Selected image file:", file);
    if (file) {
      setImageFile(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Selected video file:", file);
    if (file) {
      setVideoFile(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-12 animate-pulse">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Fashion AI Helper
        </span>
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Upload Image
          </h2>
          <div className="border-4 border-dashed border-pink-500 rounded-lg p-4 text-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-pink-500 mb-2" />
              <span className="text-lg font-semibold text-pink-500">
                {imageFile ? imageFile.name : "Choose an image"}
              </span>
            </label>
          </div>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe your desired outfit or style..."
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={3}
          />
        </div>
        <div className="flex-1 bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            Upload Video
          </h2>
          <div className="border-4 border-dashed border-blue-500 rounded-lg p-4 text-center mb-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="videoUpload"
            />
            <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-blue-500 mb-2" />
              <span className="text-lg font-semibold text-blue-500">
                {videoFile ? videoFile.name : "Choose a video"}
              </span>
            </label>
          </div>
          <textarea
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            placeholder="Describe the style or outfit you want to see in motion..."
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
