"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadMedia() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImageFiles(Array.from(files)); // Store multiple files
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setVideoFiles(Array.from(files)); // Store multiple files
    }
  };

  // Function to handle the submit action
  const handleSubmit = async () => {
    if (imageFiles.length === 0 && videoFiles.length === 0) {
      alert("Please upload an image or video.");
      return;
    }

    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("images", file); // Append each image file
    });
    videoFiles.forEach((file) => {
      formData.append("videos", file); // Append each video file
    });

    try {
      const response = await fetch("/api/upload", { 
        method: "POST", 
        body: formData 
      });

      if (response.ok) {
        alert("Media and prompt submitted successfully!");
        // Optionally reset the form
        setImageFiles([]);
        setVideoFiles([]);
        setImagePrompt("");
        setVideoPrompt("");
      } else {
        alert("Error submitting media and prompt.");
      }
    } catch (error) {
      alert("Error submitting media and prompt.");
      console.error("Error:", error);
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
        {/* Image Upload Section */}
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
              multiple // Allow multiple files to be selected
            />
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-pink-500 mb-2" />
              <span className="text-lg font-semibold text-pink-500">
                {imageFiles.length > 0
                  ? imageFiles.map((file) => file.name).join(", ") // Display all selected file names
                  : "Choose images"}
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
        {/* Video Upload Section */}
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
              multiple // Allow multiple files to be selected
            />
            <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-blue-500 mb-2" />
              <span className="text-lg font-semibold text-blue-500">
                {videoFiles.length > 0
                  ? videoFiles.map((file) => file.name).join(", ") // Display all selected file names
                  : "Choose videos"}
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
      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600 transition duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
