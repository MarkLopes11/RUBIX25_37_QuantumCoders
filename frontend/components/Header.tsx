import React from "react";
import { LucideIcon } from "lucide-react";
import { Home, Search, User, Shirt } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-n-7 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <Link href="/" className="text-2xl font-bold text-primary">
          AI Fashion Wardrobe
        </Link>
        {/* Navigation Icons on the right */}
        <nav className="flex gap-6 ml-auto">
          <Link href="/FashionAIHelper" className="text-n-3 hover:text-n-1 transition">
            <Home size={24} />
          </Link>
          <Link href="#services" className="text-n-3 hover:text-n-1 transition">
            <Shirt size={24} />
          </Link>
          <Link href="/profile" className="text-n-3 hover:text-n-1 transition">
            <User size={24} />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
