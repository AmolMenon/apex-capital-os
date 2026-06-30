import React from "react";

export const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    type="range"
    ref={ref}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className || ""}`}
    {...props}
  />
));
Slider.displayName = "Slider";
