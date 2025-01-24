'use client';
// components/Header.tsx
import React from "react";
import Link from "next/link";
import { Home, Shirt, User } from "lucide-react";
import { UserButton } from '@clerk/nextjs';
import UpgradeToProDialog from "@/components/UpgradeToProDialog"; // Import the dialog component

const Header = () => {
  // The dialog component now manages the upgrade state internally
  const handleUpgrade = () => {
    // Perform any additional tasks after upgrade (e.g., analytics, notifications)
  };

  return (
    <header className="sticky top-0 z-50 bg-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Fashion Forge
        </Link>
        {/* Navigation Icons on the right */}
        <nav className="flex gap-6 ml-auto items-center">
          <Link href="/FashionAIHelper" className="text-primary hover:text-black transition">
            <Home size={24} />
          </Link>
          <Link href="#services" className="text-primary hover:text-black transition">
            <Shirt size={24} />
          </Link>
          <Link href="#" className="text-primary hover:text-black transition">
            <User size={24} />
          </Link>
          {/* Show the upgrade dialog */}
          <UpgradeToProDialog onUpgrade={handleUpgrade} />
          <UserButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
