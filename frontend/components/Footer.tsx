import React from "react";
import { Github, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const socials = [
    {
      id: 1,
      url: "https://github.com/yourusername",
      icon: <Github size={24} />,
    },
    {
      id: 2,
      url: "https://www.instagram.com/yourusername",
      icon: <Instagram size={24} />,
    },
    {
      id: 3,
      url: "https://twitter.com/yourusername",
      icon: <Twitter size={24} />,
    },
  ];

  return (
    <footer className="bg-n-8 py-8 text-center">
      <p className="text-sm text-n-4">
        © {new Date().getFullYear()} AI Fashion Wardrobe Assistant. All rights reserved.
      </p>
      <div className="flex justify-center gap-6 mt-4">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            className="text-primary hover:text-primary-dark transition"
            rel="noopener noreferrer"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
