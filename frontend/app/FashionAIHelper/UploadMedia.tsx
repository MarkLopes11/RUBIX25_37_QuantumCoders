"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";

// Global CSS for dark theme (add to your global CSS file)
const copilotApiKey = process.env.ck_pub_94b65ab4dd382d289a397603032943b;

export default function App() {
    return (
        <CopilotKit publicApiKey={copilotApiKey}>
            <UploadMediaWithPopup />
        </CopilotKit>
    );
}

function UploadMediaWithPopup() {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePrompt, setImagePrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [outfitCombinations, setOutfitCombinations] = useState<any>(null)
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const API_URL = "http://127.0.0.1:5000/api/upload";
    const ANALYZE_API_URL = "http://127.0.0.1:5000/api/analyze";
    const OUTFITS_API_URL = "http://127.0.0.1:5000/api/outfits"

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setImageFiles(Array.from(files));
            const urls = Array.from(files).map((file) => URL.createObjectURL(file));
            setImageUrls((prevUrls) => [...prevUrls, ...urls]);
        }
    };

    const handleSubmit = async () => {
        if (imageFiles.length === 0) {
            alert("Please upload an image.");
            return;
        }
        setLoading(true)
        setOutfitCombinations(null)
        try {
            const uploadFormData = new FormData();
            imageFiles.forEach((file) => {
                uploadFormData.append("images", file);
            });
            if (imagePrompt) {
                uploadFormData.append("imagePrompt", imagePrompt);
            }
            const uploadResponse = await fetch(API_URL, {
                method: "POST",
                body: uploadFormData,
            });
            if (!uploadResponse.ok){
                alert("Error uploading the media")
                return
            }
            let all_catalogs:any[] = []
            for(const imageFile of imageFiles){
                const analyzeFormData = new FormData()
                analyzeFormData.append("image", imageFile)
                const analyzeResponse = await fetch(ANALYZE_API_URL, {
                    method: "POST",
                    body: analyzeFormData
                })
                if (analyzeResponse.ok){
                    const data = await analyzeResponse.json()
                   setAnalysisResult(data);
                   all_catalogs = [...all_catalogs, ...data];
                }
                else {
                    alert("Could not analyze the images");
                     setAnalysisResult(null);
                    return
                }
            }
            const data = await uploadResponse.json()
            alert(`Media uploaded successfully, files: ${data.files.join(", ")}`)
            setImageFiles([]);
            setImagePrompt("");
        }
        catch(error){
            alert("Error submitting media and prompt.");
            console.error("Error:", error);
        }
        finally {
            setLoading(false)
        }
    };

    const handleOutfits = async () => {
        if (!analysisResult) {
             alert("Please analyze an image first")
              return
         }
          setLoading(true)
         try {
                const outfitsResponse = await fetch(OUTFITS_API_URL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({catalog: analysisResult})
                });
                if (outfitsResponse.ok){
                    const data = await outfitsResponse.json();
                    setOutfitCombinations(data)
                    console.log("Outfits:", data)
                } else {
                     setOutfitCombinations(null);
                    alert("Could not generate outfit combinations")
                    return
                }
         }
        catch (error){
            alert("Error generating outfits: ")
            console.error("Error:", error)
        }
      finally{
         setLoading(false)
         }
    }

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
                                    multiple
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <Upload className="w-12 h-12 text-pink-500 mb-2" />
                                    <span className="text-lg font-semibold text-pink-500">
                                        Choose Images
                                    </span>
                                </label>
                                {imageFiles.length > 0 && (
                                    <div className="text-sm text-gray-500">
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
                            <textarea
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder="Describe your desired outfit or style..."
                                className="w-full p-2 rounded-md bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                rows={3}
                            />
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
                    {imageUrls.length > 0 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            {imageUrls.map((url, index) => (
                                <img key={index} src={url} alt={`Uploaded Image ${index + 1}`} className="max-w-xs rounded-md shadow-md" />
                            ))}
                        </div>
                    )}
                    
                    {analysisResult && (
                        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">Analysis Result:</h3>
                            {analysisResult.map((item:any, index: number) =>
                                <div key={index} className="text-left">
                                    <pre className="bg-gray-800 text-white p-4 rounded-md">
                                        {`Description: ${item.description}\nCategory: ${item.category}\nColors: ${item.colors?.join(', ')}\nStyle: ${item.style?.join(', ')}\nGender Type: ${item.gender_type}\nSuitable Weather: ${item.suitable_weather}\nMaterial: ${item.material}\nOccasion: ${item.occasion}`}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {analysisResult && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleOutfits}
                                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-2xl font-semibold py-4 px-8 rounded-full hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600 transition duration-300"
                                disabled={loading}
                            >
                                Get Outfit Recommendations
                            </button>
                        </div>
                    )}
                    
                    {outfitCombinations && (
                        <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-white">Outfit Suggestions:</h3>
                            {outfitCombinations.outfits.split("**").map((item: string, index: number) => {
                                if(item.startsWith("Outfit")){
                                    return (
                                        <h3 key={index} className="mt-4 font-semibold text-lg text-white">
                                            {item.replace("*", "").trim()}
                                        </h3>
                                    )
                                }else if(item.startsWith("Description")){
                                    return (
                                        <p key={index} className='text-gray-400'>
                                            {item.replace("*", "").trim()}
                                        </p>
                                    )
                                }
                                else if(item.startsWith("Bottoms:") || item.startsWith("Top:")){
                                    const [label, value] = item.split(":")
                                    return (
                                        <div key={index} className="ml-0 flex">
                                            <span className="font-semibold text-gray-300">
                                                {label.replace("*","").trim()}: 
                                            </span>
                                            <span className="text-white">
                                                {value.replace("*", "").trim()}
                                            </span>
                                        </div>
                                    )
                                } else{
                                    return (
                                        <p key={index} className='text-white'>
                                            {item}
                                        </p>
                                    )
                                }
                            })}
                            <h3 className="text-xl font-semibold mt-4 text-white">Recommended Items:</h3>
                            {outfitCombinations.recommendations ? (
                                outfitCombinations.recommendations.map((item: any, index: number) => (
                                    <div key={index}>
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-500 hover:text-blue-300"
                                        >
                                            {item.description}
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">Could not get recommendations</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <CopilotPopup 
                instructions={"You are a fashion AI assistant helping users with style, outfit combinations, and clothing recommendations. Provide personalized, creative, and practical fashion advice.Other than fashion, dont answer any questions and reply that I can only answer fashion related questions"}
                labels={{
                    title: "Fashion AI Assistant",
                    initial: "Need help styling your outfit?",
                }}
                className="copilot-popup"
            />
        </>
    );
}