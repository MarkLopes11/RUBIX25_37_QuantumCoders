"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from '@/components/ui/card';

const copilotKitApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;

export default function App() {
    return (
        <CopilotKit publicApiKey={copilotKitApiKey}>
            <UploadMediaWithPopup />
        </CopilotKit>
    );
}

function UploadMediaWithPopup() {
    const [imageURL, setImageURL] = useState(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [outfitCombinations, setOutfitCombinations] = useState<any>(null)
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const API_URL = "http://127.0.0.1:5000/api/upload";
    const ANALYZE_API_URL = "http://127.0.0.1:5000/api/analyze";
    const OUTFITS_API_URL = "http://127.0.0.1:5000/api/outfits";
    const IMAGE_API_URI = "http://127.0.0.1:5000/api/ai_image";

    const handleAiImage = async () => {
        try {
            const response = await fetch(IMAGE_API_URI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch AI image");
            }
    
            const data = await response.json();
            if (data.ai_image) {
                setImageURL(data.ai_image); 
                console.log("AI Image URL:", data.ai_image);
            } else {
                console.error("No image URL received from the server");
            }
        } catch (error) {
            console.error("Error fetching AI image:", error);
        }
    };
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
            const uploadResponse = await fetch(API_URL, {
                method: "POST",
                body: uploadFormData,
            });
            if (!uploadResponse.ok) {
                alert("Error uploading the media")
                return
            }
            let all_catalogs: any[] = []
            for (const imageFile of imageFiles) {
                const analyzeFormData = new FormData()
                analyzeFormData.append("image", imageFile)
                const analyzeResponse = await fetch(ANALYZE_API_URL, {
                    method: "POST",
                    body: analyzeFormData
                })
                if (analyzeResponse.ok) {
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
        }
        catch (error) {
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
                body: JSON.stringify({ catalog: analysisResult })
            });
            if (outfitsResponse.ok) {
                const data = await outfitsResponse.json();
                setOutfitCombinations(data)
                console.log("Outfits:", data)
            } else {
                setOutfitCombinations(null);
                alert("Could not generate outfit combinations")
                return
            }
        }
        catch (error) {
            alert("Error generating outfits: ")
            console.error("Error:", error)
        }
        finally {
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
                        <div className="w-full bg-gray-900 rounded-lg shadow-xl p-6">
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
                                    className="cursor-pointer flex flex-col items-center justify-center h-48"
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
                        <div className="overflow-x-auto">
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {analysisResult.map((item: any, index: number) => (
                                    <Card key={index} className="mt-5 bg-gradient-to-r from-[#0894FF] to-[#C959DD] p-1 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-95">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-semibold text-white text-center">Analysis Result {index + 1}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <p className="text-left mb-4 text-white">Description: {item.description}</p>
                                                <p className="text-left mb-4 text-white">Category: {item.category}</p>
                                                <p className="text-left mb-4 text-white">Colors: {item.colors?.join(', ') || 'N/A'}</p>
                                                <p className="text-left mb-4 text-white">Style: {item.style?.join(', ') || 'N/A'}</p>
                                                <p className="text-left mb-4 text-white">Gender Type: {item.gender_type || 'N/A'}</p>
                                                <p className="text-left mb-4 text-white">Suitable Weather: {item.suitable_weather || 'N/A'}</p>
                                                <p className="text-left mb-4 text-white">Material: {item.material || 'N/A'}</p>
                                                <p className="text-left mb-4 text-white">Occasion: {item.occasion || 'N/A'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
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
                        <div className="mt-6 bg-gradient-to-b from-purple-500 to-indigo-500 p-4 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold text-white">Outfit Suggestions:</h3>
                            <div className="space-y-4">
                                {outfitCombinations.outfits.split("**").map((item: string, index: number) => {
                                    if (item.startsWith("Outfit")) {
                                        return (
                                            <h3 key={index} className="mt-4 font-semibold text-lg text-white">
                                                {item.replace("*", "").trim()}
                                            </h3>
                                        );
                                    } else if (item.startsWith("Description")) {
                                        return (
                                            <p key={index} className="text-gray-300">
                                                {item.replace("*", "").trim()}
                                            </p>
                                        );
                                    } else if (item.startsWith("Bottoms:") || item.startsWith("Top:")) {
                                        const [label, value] = item.split(":");
                                        return (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-200 mr-2">{label.replace("*", "").trim()}:</span>
                                                <span className="text-white">{value.replace("*", "").trim()}</span>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <p key={index} className="text-white">
                                                {item}
                                            </p>
                                        );
                                    }
                                })}

                                <h3 className="mt-4 font-semibold text-lg text-white">Recommended Items:</h3>
                                {outfitCombinations.recommendations ? (
                                    <ul className="list-disc list-inside text-white">
                                        {outfitCombinations.recommendations.map((item: any, index: number) => (
                                            <li key={index}>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-300 underline"
                                                >
                                                    {item.description}
                                                </a>
                                            </li>
                                        ))}
                                    {imageURL && (
                                            <div className="mt-6">
                                                <img
                                                    src={imageURL}
                                                    alt="Analyzed Image"
                                                    className="rounded-lg shadow-lg"
                                                />
                                            </div>
                                        )}

                                        <button onClick={handleAiImage} className="btn btn-primary mt-4">
                                            Generate AI Image
                                        </button>
                                    </ul>
                                ) : (
                                    <p className="text-white">Could not get recommendations</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8">
  <h2 className="text-2xl font-semibold text-center mb-4 text-white">Explore Fashion Styles</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-5 mr-5">
    {[
      { 
        src: "https://api.together.ai/imgproxy/OkngJC4v3I5hjAttaD_aRyrpNHIyCDIdxWYHVlqldFk/format:jpeg/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzAyMjBkNGM3NTVmNzFkODc0Yjk4MmE2MGQ3MTE5YzNmODMyN2VkMWM1ZWJhYmJiNjIzNDk0Mjk4MzkwNTc3ZDU_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0RRMldSTkdKJTJGMjAyNTAxMjMlMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTIzVDE1MzY0MVomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFUGolMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkZ3RWFDWFZ6TFhkbGMzUXRNaUpJTUVZQ0lRRHR3ZjZiUE1WNEJUS014aEltcnJLQm5ZSW8lMkJhNW9HdGJjU1NYcERES2ZJZ0loQU81Rkk3Q2d0Tm5xOUlSQyUyQlV4ZFdwYk02aSUyQkwwdEVPUWpmY212bFByWmV2S3BrRkNQSCUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRndFUUFCb01OVGs0TnpJMk1UWXpOemd3SWd4JTJCekZtdjQ3OXY2aUJ4SWdrcTdRVEtLQ3JROVdpWDdVODUwcVJTbUY1dHNxTG0zVzclMkJWJTJGUXRQUWlOODF6Uzh3SG5pTDNRUmhGeklXYmlkeDZoVXV3dklNekxFSnglMkZCUTFrMVF6cndMa3BoOXkyYUtENTNXZSUyRm01YXNwU1FWU25XMDZQb05LTW5aQmNTMmFuRGJOVFhabzJieGFkSmZJUW1zVCUyRkV0WjNZQm9DVUlWNDMzTDY2dFYyNjlnWXk0c0RFTjBRTzA2dmVZVElYckU4a0w5QmFob0V6c1o2JTJGSWtrVmJ3dWpIdGFaQ0prOEJBWEx3YllDWCUyRll3YXNEVnZFSDNXVzJCZzdhVm9mMkRBSm9PSktLcWxDNFhBYnpZazdqNUtQYzdnaEI3JTJCbFNPazZ1OWRGNHk4WTI4UG5jNzViaGFaTWd6ZmpsUndBWDF3JTJCTXVuemJjRllMVjNXU2JmVlRIVGdmbndlRzZJck56UW16dE1uRGlBb0lYalZHJTJCWXVjN3FCTzFQb2sxM0NtWWJGRWRIVFUzWUwwNW1wTVE0dGN4dm9CbUk4d3h3RGdNUDAySlhrUTJFYzFyejhhZ1I1WGMyd3VzaFZDM2lQSzJqdFFIeGpjZEQlMkIzRzg4THdEM2Nmc1hkVERxNHExSjh3OXM2RG5NWThyQVE2YmYzNjdlQVF5SlRoNTlPb1Y5ZnJ0OE9SdGt6bHBwYzgwZDFXdlQ1JTJGd2FoN0lHREVPdXhpaDRFUGo1cHQlMkZvcjM0SDdndyUyRjdBODNBQ1k5ZXFOZFhaVk91elM1NWNnRDdCS25IOTBVMW5HZ0ZJR3poc0VubnlYYWlZSDhndjFIbTMyU0ttT21mblRNR29nRUdPcTk2eG9PYTVLJTJGVnhYelc5Q3g1a1JEUzRlQW5NRGdFNVVjV3RSU0JwckxoQW1hTEZPcXElMkZqemFhJTJGd3U1SXNkMmhFWGRIVExvNEZZOXBGUTVZeTgxT1dGQ1d5Wm1JWDB4b3BNUVVNVDFFM2YyaVpTOWQ2enk3RGc2eWRpVHdYNVk1VFBPejdhb3BLeTYyb0VvcFVEdkxDb0NnR3R2ZXd6alRuQk9SWmklMkZaeWVLMHNMNUZEbk9Hd1dnTEJ0R0VKbG00S2MzUHJ5OHdpY1RKdkFZNm1nR3BnZ2hxTXUxREZldXJ2JTJCNnVSUkN0VDhlejVuaVEyTGVjdXlOUXFaV3BzYnhKVlFNSXlOUk04UDVEMEtDcU90aTVNdGg4bTAxN2ZYdXV2ekdGbVBJZVNFJTJCTU1zTXM4RXlLajVPYmJjJTJCOHNJdVFkalA2NEFlJTJGWnR4UDNHN0dJQWp5UkVPV1pkWGF4dGYzcm55R0E4OHljaEhaSjhOd1A5aUtPZjNkaXRoeXl6WGRMcTFoQ0hpczMlMkZpUiUyQkZxRmRYMjB4QzkxbjglMkJPQXNxUSZYLUFtei1TaWduYXR1cmU9OTFkMTI4NGY5OGM2NjFmZDgzMjU5ZDg5YmEzNzNhNWU1ZTQ4NDIxZGQ1YjJjZjJjMjk5Y2E1MTAyYTkxYjQ4MiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmeC1pZD1HZXRPYmplY3Q", 
        title: "AI Generated Fashion" 
      },
      { 
        src: "https://api.together.ai/imgproxy/OkngJC4v3I5hjAttaD_aRyrpNHIyCDIdxWYHVlqldFk/format:jpeg/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzAyMjBkNGM3NTVmNzFkODc0Yjk4MmE2MGQ3MTE5YzNmODMyN2VkMWM1ZWJhYmJiNjIzNDk0Mjk4MzkwNTc3ZDU_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0RRMldSTkdKJTJGMjAyNTAxMjMlMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTIzVDE1MzY0MVomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFUGolMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkZ3RWFDWFZ6TFhkbGMzUXRNaUpJTUVZQ0lRRHR3ZjZiUE1WNEJUS014aEltcnJLQm5ZSW8lMkJhNW9HdGJjU1NYcERES2ZJZ0loQU81Rkk3Q2d0Tm5xOUlSQyUyQlV4ZFdwYk02aSUyQkwwdEVPUWpmY212bFByWmV2S3BrRkNQSCUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRndFUUFCb01OVGs0TnpJMk1UWXpOemd3SWd4JTJCekZtdjQ3OXY2aUJ4SWdrcTdRVEtLQ3JROVdpWDdVODUwcVJTbUY1dHNxTG0zVzclMkJWJTJGUXRQUWlOODF6Uzh3SG5pTDNRUmhGeklXYmlkeDZoVXV3dklNekxFSnglMkZCUTFrMVF6cndMa3BoOXkyYUtENTNXZSUyRm01YXNwU1FWU25XMDZQb05LTW5aQmNTMmFuRGJOVFhabzJieGFkSmZJUW1zVCUyRkV0WjNZQm9DVUlWNDMzTDY2dFYyNjlnWXk0c0RFTjBRTzA2dmVZVElYckU4a0w5QmFob0V6c1o2JTJGSWtrVmJ3dWpIdGFaQ0prOEJBWEx3YllDWCUyRll3YXNEVnZFSDNXVzJCZzdhVm9mMkRBSm9PSktLcWxDNFhBYnpZazdqNUtQYzdnaEI3JTJCbFNPazZ1OWRGNHk4WTI4UG5jNzViaGFaTWd6ZmpsUndBWDF3JTJCTXVuemJjRllMVjNXU2JmVlRIVGdmbndlRzZJck56UW16dE1uRGlBb0lYalZHJTJCWXVjN3FCTzFQb2sxM0NtWWJGRWRIVFUzWUwwNW1wTVE0dGN4dm9CbUk4d3h3RGdNUDAySlhrUTJFYzFyejhhZ1I1WGMyd3VzaFZDM2lQSzJqdFFIeGpjZEQlMkIzRzg4THdEM2Nmc1hkVERxNHExSjh3OXM2RG5NWThyQVE2YmYzNjdlQVF5SlRoNTlPb1Y5ZnJ0OE9SdGt6bHBwYzgwZDFXdlQ1JTJGd2FoN0lHREVPdXhpaDRFUGo1cHQlMkZvcjM0SDdndyUyRjdBODNBQ1k5ZXFOZFhaVk91elM1NWNnRDdCS25IOTBVMW5HZ0ZJR3poc0VubnlYYWlZSDhndjFIbTMyU0ttT21mblRNR29nRUdPcTk2eG9PYTVLJTJGVnhYelc5Q3g1a1JEUzRlQW5NRGdFNVVjV3RSU0JwckxoQW1hTEZPcXElMkZqemFhJTJGd3U1SXNkMmhFWGRIVExvNEZZOXBGUTVZeTgxT1dGQ1d5Wm1JWDB4b3BNUVVNVDFFM2YyaVpTOWQ2enk3RGc2eWRpVHdYNVk1VFBPejdhb3BLeTYyb0VvcFVEdkxDb0NnR3R2ZXd6alRuQk9SWmklMkZaeWVLMHNMNUZEbk9Hd1dnTEJ0R0VKbG00S2MzUHJ5OHdpY1RKdkFZNm1nR3BnZ2hxTXUxREZldXJ2JTJCNnVSUkN0VDhlejVuaVEyTGVjdXlOUXFaV3BzYnhKVlFNSXlOUk04UDVEMEtDcU90aTVNdGg4bTAxN2ZYdXV2ekdGbVBJZVNFJTJCTU1zTXM4RXlLajVPYmJjJTJCOHNJdVFkalA2NEFlJTJGWnR4UDNHN0dJQWp5UkVPV1pkWGF4dGYzcm55R0E4OHljaEhaSjhOd1A5aUtPZjNkaXRoeXl6WGRMcTFoQ0hpczMlMkZpUiUyQkZxRmRYMjB4QzkxbjglMkJPQXNxUSZYLUFtei1TaWduYXR1cmU9OTFkMTI4NGY5OGM2NjFmZDgzMjU5ZDg5YmEzNzNhNWU1ZTQ4NDIxZGQ1YjJjZjJjMjk5Y2E1MTAyYTkxYjQ4MiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmeC1pZD1HZXRPYmplY3Q", 
        title: "AI Generated Fashion" 
      },
      { 
        src: "https://api.together.ai/imgproxy/OkngJC4v3I5hjAttaD_aRyrpNHIyCDIdxWYHVlqldFk/format:jpeg/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzAyMjBkNGM3NTVmNzFkODc0Yjk4MmE2MGQ3MTE5YzNmODMyN2VkMWM1ZWJhYmJiNjIzNDk0Mjk4MzkwNTc3ZDU_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0RRMldSTkdKJTJGMjAyNTAxMjMlMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTIzVDE1MzY0MVomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFUGolMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkYlMkZ3RWFDWFZ6TFhkbGMzUXRNaUpJTUVZQ0lRRHR3ZjZiUE1WNEJUS014aEltcnJLQm5ZSW8lMkJhNW9HdGJjU1NYcERES2ZJZ0loQU81Rkk3Q2d0Tm5xOUlSQyUyQlV4ZFdwYk02aSUyQkwwdEVPUWpmY212bFByWmV2S3BrRkNQSCUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRndFUUFCb01OVGs0TnpJMk1UWXpOemd3SWd4JTJCekZtdjQ3OXY2aUJ4SWdrcTdRVEtLQ3JROVdpWDdVODUwcVJTbUY1dHNxTG0zVzclMkJWJTJGUXRQUWlOODF6Uzh3SG5pTDNRUmhGeklXYmlkeDZoVXV3dklNekxFSnglMkZCUTFrMVF6cndMa3BoOXkyYUtENTNXZSUyRm01YXNwU1FWU25XMDZQb05LTW5aQmNTMmFuRGJOVFhabzJieGFkSmZJUW1zVCUyRkV0WjNZQm9DVUlWNDMzTDY2dFYyNjlnWXk0c0RFTjBRTzA2dmVZVElYckU4a0w5QmFob0V6c1o2JTJGSWtrVmJ3dWpIdGFaQ0prOEJBWEx3YllDWCUyRll3YXNEVnZFSDNXVzJCZzdhVm9mMkRBSm9PSktLcWxDNFhBYnpZazdqNUtQYzdnaEI3JTJCbFNPazZ1OWRGNHk4WTI4UG5jNzViaGFaTWd6ZmpsUndBWDF3JTJCTXVuemJjRllMVjNXU2JmVlRIVGdmbndlRzZJck56UW16dE1uRGlBb0lYalZHJTJCWXVjN3FCTzFQb2sxM0NtWWJGRWRIVFUzWUwwNW1wTVE0dGN4dm9CbUk4d3h3RGdNUDAySlhrUTJFYzFyejhhZ1I1WGMyd3VzaFZDM2lQSzJqdFFIeGpjZEQlMkIzRzg4THdEM2Nmc1hkVERxNHExSjh3OXM2RG5NWThyQVE2YmYzNjdlQVF5SlRoNTlPb1Y5ZnJ0OE9SdGt6bHBwYzgwZDFXdlQ1JTJGd2FoN0lHREVPdXhpaDRFUGo1cHQlMkZvcjM0SDdndyUyRjdBODNBQ1k5ZXFOZFhaVk91elM1NWNnRDdCS25IOTBVMW5HZ0ZJR3poc0VubnlYYWlZSDhndjFIbTMyU0ttT21mblRNR29nRUdPcTk2eG9PYTVLJTJGVnhYelc5Q3g1a1JEUzRlQW5NRGdFNVVjV3RSU0JwckxoQW1hTEZPcXElMkZqemFhJTJGd3U1SXNkMmhFWGRIVExvNEZZOXBGUTVZeTgxT1dGQ1d5Wm1JWDB4b3BNUVVNVDFFM2YyaVpTOWQ2enk3RGc2eWRpVHdYNVk1VFBPejdhb3BLeTYyb0VvcFVEdkxDb0NnR3R2ZXd6alRuQk9SWmklMkZaeWVLMHNMNUZEbk9Hd1dnTEJ0R0VKbG00S2MzUHJ5OHdpY1RKdkFZNm1nR3BnZ2hxTXUxREZldXJ2JTJCNnVSUkN0VDhlejVuaVEyTGVjdXlOUXFaV3BzYnhKVlFNSXlOUk04UDVEMEtDcU90aTVNdGg4bTAxN2ZYdXV2ekdGbVBJZVNFJTJCTU1zTXM4RXlLajVPYmJjJTJCOHNJdVFkalA2NEFlJTJGWnR4UDNHN0dJQWp5UkVPV1pkWGF4dGYzcm55R0E4OHljaEhaSjhOd1A5aUtPZjNkaXRoeXl6WGRMcTFoQ0hpczMlMkZpUiUyQkZxRmRYMjB4QzkxbjglMkJPQXNxUSZYLUFtei1TaWduYXR1cmU9OTFkMTI4NGY5OGM2NjFmZDgzMjU5ZDg5YmEzNzNhNWU1ZTQ4NDIxZGQ1YjJjZjJjMjk5Y2E1MTAyYTkxYjQ4MiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmeC1pZD1HZXRPYmplY3Q", 
        title: "AI Generated Fashion" 
      },
    ].map((item, index) => (
      <Card
        key={index}
        className="rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-95 mb-5"
      >
        <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
          <img 
            src={item.src} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      </Card>
    ))}
  </div>
</div>


            <CopilotPopup
                instructions={"You are a fashion AI assistant helping users with style, outfit combinations, and clothing recommendations. Provide personalized, creative, and practical fashion advice.Other than fashion, dont answer any questions and reply that I can only answer fashion related questions"}
                labels={{
                    title: "Fashion AI Assistant",
                    initial: "Hey there👋! Need help styling your outfit ?",
                }}
                className="copilot-popup"
            />
        </>
    );
}