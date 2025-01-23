"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set canvas background color to black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    class Snowflake {
      x: number;
      y: number;
      speed: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width; // Random horizontal position
        this.y = Math.random() * canvas.height; // Random vertical position
        this.speed = 1 + Math.random() * 3; // Random falling speed
        this.size = 2 + Math.random() * 5; // Random size of snowflake
      }

      update() {
        this.y += this.speed; // Move snowflake down
        if (this.y > canvas.height) {
          this.y = 0; // Reset to top once it reaches the bottom
          this.x = Math.random() * canvas.width; // Randomize horizontal position
        }
      }

      draw() {
        ctx!.fillStyle = "rgba(255, 255, 255, 0.8)"; // White color for snowflakes
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Draw snowflake as circle
        ctx!.fill();
      }
    }

    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < 200; i++) {
      snowflakes.push(new Snowflake()); // Generate 200 snowflakes
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Set background back to black
      snowflakes.forEach((snowflake) => {
        snowflake.update(); // Update position of each snowflake
        snowflake.draw(); // Draw each snowflake
      });
      requestAnimationFrame(animate); // Repeat the animation
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
