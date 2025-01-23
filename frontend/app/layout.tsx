import React from "react";
import Header from "@/components/Header";  // Make sure Header is in the correct file
import Footer from "@/components/Footer";  // Correctly import Footer
import "@/styles/globals.css";  // Import the global styles
export const metadata = {
  title: "AI Fashion Wardrobe Assistant",
  description: "Personalized fashion assistant powered by AI to help you manage your wardrobe.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-n-8 text-n-1">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
