import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = Array.from({ length: number || 40 }); // Increased meteor count for density
  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-0 left-1/2 h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            left: Math.random() * 100 + "vw", // Random horizontal positioning
            top: Math.random() * -200 + "px",  // Starts above the screen
            animationDelay: Math.random() * 0.6 + "s", // Randomized delay
            animationDuration: Math.random() * 8 + 4 + "s", // Varying speeds
          }}
        ></span>
      ))}
    </>
  );
};
