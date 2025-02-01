"use client";
import React, { useState, useRef } from "react";
import { Upload, FileDown, ArrowRight, Camera } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function App() {
    const copilotKitApiKey = process.env.NEXT_PUBLIC_COPILOT_KEY;
    return (
        <CopilotKit publicApiKey={copilotKitApiKey}>
            <UploadMediaWithPopup />
        </CopilotKit>
    );
}

function UploadMediaWithPopup() {
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [outfitLoading, setOutfitLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [outfitCombinations, setOutfitCombinations] = useState<any>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [reportDownloaded, setReportDownloaded] = useState(false);
    const API_URL = "http://127.0.0.1:5000/api/upload";
    const ANALYZE_API_URL = "http://127.0.0.1:5000/api/analyze";
    const OUTFITS_API_URL = "http://127.0.0.1:5000/api/outfits";
    const IMAGE_API_URI = "http://127.0.0.1:5000/api/ai_image";
    const REPORT_API_URL = "http://127.0.0.1:5000/api/generate_report";
    const REDIRECT_URL = "https://fashion-rag.streamlit.app/";
     const videoRef = useRef<HTMLVideoElement>(null); // Ref for video element
    const [isCameraOpen, setIsCameraOpen] = useState(false)

    const clearError = () => {
        setError(null);
    };

    const handleAiImage = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(IMAGE_API_URI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error || "Failed to fetch AI image");
            }

            const data = await response.json();
            if (data.ai_image) {
                setImageURL(data.ai_image);
                console.log("AI Image URL:", data.ai_image);
            } else {
                console.error("No image URL received from the server");
                throw new Error("No image URL received from the server");
            }
        } catch (error: any) {
            console.error("Error fetching AI image:", error);
            setError(error?.message || "Failed to fetch AI image");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
         if(files){
               setImageFiles(Array.from(files));
                const urls = Array.from(files).map((file) => URL.createObjectURL(file));
                setImageUrls((prevUrls) => [...prevUrls, ...urls]);
          }
    };

     const handleCameraOpen = async () => {
        setIsCameraOpen(true);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera not supported on this browser");
            }
             const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio:false,
            });
            if(videoRef.current){
                 videoRef.current.srcObject=stream;
            }

        } catch (error: any) {
            console.error("Error accessing camera:", error);
             setError(error?.message || "Error accessing camera")
             setIsCameraOpen(false)
        }
     }
     const handleTakePhoto = () => {
        if(!videoRef.current){
          setError("Camera not opened")
             return;
        }
        const video = videoRef.current;

        const canvas = document.createElement('canvas');
        canvas.width=video.videoWidth;
        canvas.height=video.videoHeight;

        const context=canvas.getContext('2d');
        if(!context){
             setError("Failed to get canvas context.")
             return;
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

         canvas.toBlob(blob => {
                if (blob) {
                   const file = new File([blob], 'photo.png', { type: 'image/png' });
                   setImageFiles([file]);
                    const url= URL.createObjectURL(file)
                   setImageUrls([url])
                    setIsCameraOpen(false);
                }
                else{
                   setError("Error creating blob")
                }
            }, 'image/png');

       if(video.srcObject){
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
           video.srcObject=null;
       }
    }


    const handleSubmit = async () => {
        if (imageFiles.length === 0) {
            setError("Please upload an image.");
            return;
        }
        setLoading(true);
        setError(null);
        setOutfitCombinations(null);
        setReportDownloaded(false);

        try {
            const uploadFormData = new FormData();
            imageFiles.forEach((file) => {
                uploadFormData.append("images", file);
            });
            const uploadResponse = await fetch(API_URL, {
                method: "POST",
                body: uploadFormData,
            });
            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData?.error || "Error uploading the media");
            }
            let all_catalogs: any[] = [];
            for (const imageFile of imageFiles) {
                const analyzeFormData = new FormData();
                analyzeFormData.append("image", imageFile);
                const analyzeResponse = await fetch(ANALYZE_API_URL, {
                    method: "POST",
                    body: analyzeFormData,
                });
                if (analyzeResponse.ok) {
                    const data = await analyzeResponse.json();
                    setAnalysisResult(data);
                    all_catalogs = [...all_catalogs, ...data];
                } else {
                    const errorData = await analyzeResponse.json();
                    throw new Error(errorData?.error || "Could not analyze the images");
                }
            }
            const data = await uploadResponse.json();
            alert(`Media uploaded successfully, files: ${data.files.join(", ")}`);
            setImageFiles([]);
        } catch (error: any) {
            console.error("Error submitting media and prompt:", error);
            setError(error?.message || "Error submitting media and prompt.");
        } finally {
            setLoading(false);
        }
    };

    const handleOutfits = async () => {
        if (!analysisResult) {
            setError("Please analyze an image first");
            return;
        }
        setOutfitLoading(true)
        setError(null);
        setReportDownloaded(false);

        try {
            const outfitsResponse = await fetch(OUTFITS_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ catalog: analysisResult }),
            });
            if (outfitsResponse.ok) {
                const data = await outfitsResponse.json();
                setOutfitCombinations(data);
                console.log("Outfits:", data);
            } else {
                const errorData = await outfitsResponse.json();
                throw new Error(
                    errorData?.error || "Could not generate outfit combinations"
                );
            }
        } catch (error: any) {
            console.error("Error generating outfits:", error);
            setError(error?.message || "Error generating outfits");
        } finally {
           setOutfitLoading(false)
        }
    };

     const handleRedirect = () => {
       window.open(REDIRECT_URL, "_blank");
     };

    const handleGenerateReport = async () => {
        if (!analysisResult || !outfitCombinations) {
            setError("Please analyze an image and generate outfits first.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(REPORT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    analysisResult: analysisResult,
                    outfitCombinations: outfitCombinations,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error || "Failed to generate report.");
            }

            // Handle the file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "fashion_report.txt";
            a.click();
            window.URL.revokeObjectURL(url);
            setReportDownloaded(true);
        } catch (error: any) {
            console.error("Error downloading the report", error);
            setError(error?.message || "Error downloading the report");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteImage = (index: number) => {
        const newFiles = [...imageFiles];
        newFiles.splice(index, 1);
        setImageFiles(newFiles);
        const newUrls = [...imageUrls];
        newUrls.splice(index, 1);
        setImageUrls(newUrls);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8 flex">
                <div className="w-full">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-12 animate-pulse">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                            Fashion Forge
                        </span>
                    </h1>
                    {error && (
                        <div
                            className="bg-red-200 border border-red-500 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                        >
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline">{error}</span>
                            <span
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                onClick={clearError}
                            >
                                <svg
                                    className="fill-current h-6 w-6 text-red-500"
                                    role="button"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full bg-gray-900 rounded-lg shadow-xl p-6">
                            <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
                                Upload Image
                            </h2>
                            <div className="border-4 border-dashed border-pink-500 rounded-lg p-12 text-center mb-4 relative">
                              {isCameraOpen && (
                                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                  <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
                                      <video ref={videoRef} autoPlay className="max-w-md max-h-96 rounded-xl"></video>
                                       <div className="mt-4 flex justify-center gap-4">
                                          <button onClick={handleTakePhoto} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 transition-all">
                                             Take Photo
                                          </button>
                                            <button onClick={()=> setIsCameraOpen(false)} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 transition-all">
                                             Close Camera
                                          </button>
                                       </div>
                                    </div>
                                </div>
                              )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="imageUpload"
                                    multiple
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="cursor-pointer flex flex-col items-center justify-center h-48 h-auto"
                                >
                                    <Upload className="w-12 h-12 text-pink-500 mb-2" />
                                    <span className="text-lg font-semibold text-pink-500">
                                        Choose Images
                                    </span>
                                </label>

                                   <button
                                        onClick={handleCameraOpen}
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold py-2 px-4 rounded-full mt-4 transition-all"
                                   >
                                        <Camera className="w-5 h-5 mr-2" />Open Camera
                                    </button>

                                {imageUrls.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                                        {imageUrls.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Uploaded Image ${index + 1}`}
                                                className="max-w-xs rounded-md shadow-md object-contain"
                                            />
                                        ))}
                                    </div>
                                )}
                                {imageFiles.length > 0 && (
                                    <div className="text-sm text-gray-500 mt-2">
                                        {imageFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-row gap-2 justify-center items-center"
                                            >
                                                <span>{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-8">
                        {loading && <ClipLoader color="#f472b6" size={24} />}
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600 transition duration-300"
                            disabled={loading}
                        >
                            Submit
                        </button>
                    </div>

                    {analysisResult && (
                        <div className="overflow-x-auto">
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {analysisResult.map((item: any, index: number) => (
                                    <Card
                                        key={index}
                                        className="mt-5 bg-gradient-to-r from-[#0894FF] to-[#C959DD] p-1 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-95"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-semibold text-white text-center">
                                                Analysis Result {index + 1}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <p className="text-left mb-4 text-white">
                                                    Description: {item.description}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Category: {item.category}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Colors: {item.colors?.join(", ") || "N/A"}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Style: {item.style?.join(", ") || "N/A"}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Gender Type: {item.gender_type || "N/A"}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Suitable Weather: {item.suitable_weather || "N/A"}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Material: {item.material || "N/A"}
                                                </p>
                                                <p className="text-left mb-4 text-white">
                                                    Occasion: {item.occasion || "N/A"}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="flex justify-center mt-8">
                             {outfitLoading && <ClipLoader color="#f472b6" size={24} />}
                            <button
                                onClick={handleOutfits}
                                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600 transition duration-300"
                                disabled={outfitLoading}
                            >
                                Get Outfit Recommendations
                            </button>
                        </div>
                    )}

{outfitCombinations && (
    <div className="mt-6 bg-gradient-to-b from-purple-500 to-indigo-500 p-6 rounded-xl shadow-xl">
        <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Outfit Suggestions:
        </h3>
        
        {/* Display each outfit combination */}
        <div className="space-y-8">
            {outfitCombinations.outfits.split("**").map((item: string, index: number) => {
                // Clean up the string by removing the asterisks
                const cleanItem = item.replace(/\*/g, "").trim();

                if (cleanItem.startsWith("Outfit")) {
                    return (
                        <h4 key={index} className="hover:shadow-xl transform transition-all hover:scale-95 font-bold text-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-md text-center">
                            {cleanItem}
                        </h4>
                    );
                } else if (cleanItem.startsWith("Description")) {
                    return (
                        <p key={index} className="font-semibold text-gray-200 italic text-lg">
                            {cleanItem}
                        </p>
                    );
                } else if (cleanItem.startsWith("Bottoms:") || cleanItem.startsWith("Top:")) {
                    const [label, value] = cleanItem.split(":");
                    return (
                        <div key={index} className="flex items-center justify-between text-white text-lg font-semibold mt-2">
                            <span className="font-bold text-gray-300 text-xl">{label.trim()}:</span>
                            <span className="text-xl">{value.trim()}</span>
                        </div>
                    );
                } else if (cleanItem.startsWith("Items:") || cleanItem.startsWith("Description:")) {
                    // Bold "Items:" and "Description:" labels with larger size
                    return (
                        <div key={index} className="text-white text-xl">
                            <span className="font-semibold text-2xl">{cleanItem.split(":")[0]}:</span>
                            <span className="ml-2 text-xl">{cleanItem.split(":")[1]}</span>
                        </div>
                    );
                } else {
                    return (
                        <p key={index} className="text-white text-lg">{cleanItem}</p>
                    );
                }
            })}

            {/* Recommended Items Section */}
            <h4 className="mt-6 font-semibold text-2xl text-white"></h4>
            {outfitCombinations.recommendations ? (
                <ul className="list-disc list-inside text-white space-y-4">
                    {outfitCombinations.recommendations.map((item: any, index: number) => (
                        <li key={index} className="flex items-center space-x-4 text-lg">
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-500 underline font-semibold transition-all"
                            >
                                {item.description}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-white text-lg"></p>
            )}
        </div>
    </div>
)}


                    {outfitCombinations && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleAiImage}
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition duration-300"
                            >
                                Generate AI Image
                            </button>
                        </div>
                    )}
                   {outfitCombinations && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleGenerateReport}
                                className="bg-gradient-to-r from-green-500 to-lime-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-green-600 hover:to-lime-600 transition duration-300"
                                disabled={loading}
                            >
                                <FileDown className="w-5 h-5 mr-2" /> Generate Report
                            </button>
                        </div>
                    )}
                     {reportDownloaded && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleRedirect}
                                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 transition duration-300"
                            >
                                Explore More! <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}
                    {imageURL && (
                        <div className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-5 mr-5">
                                <Card className="rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-95 mb-5">
                                    <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
                                        <img
                                            src={imageURL}
                                            alt="Analyzed Image"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CopilotPopup
                instructions={
                    "You are a fashion AI assistant helping users with style, outfit combinations, and clothing recommendations. Provide personalized, creative, and practical fashion advice.Other than fashion, dont answer any questions and reply that I can only answer fashion related questions"
                }
                labels={{
                    title: "Fashion AI Assistant",
                    initial: "Hey there👋! Need help styling your outfit ?",
                }}
                className="copilot-popup"
            />
        </>
    );
}