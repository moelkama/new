"use client";

import React, { useState } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import Image from "next/image";
import { tv } from "tailwind-variants";

// Simple SVG fallback
const defaultFallbackImage = "https://placecats.com/300/300";

interface AvatarProps {
  src?: string;
  fallback?: string;
  fallbackText?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "gray" | "red" | "blue" | "green";
}

const rootStyles = tv({
  base: "relative inline-flex items-center justify-center overflow-hidden rounded-full border-4",
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-20 w-20",
    },
    color: {
      gray: "border-gray-400",
      red: "border-red-500",
      blue: "border-blue-500",
      green: "border-green-500",
    },
  },
  defaultVariants: {
    size: "md",
    color: "gray",
  },
});

const fallbackStyles = tv({
  base: "flex h-full w-full items-center justify-center text-center font-medium text-white",
  variants: {
    color: {
      gray: "bg-gray-400",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    color: "gray",
    size: "md",
  },
});

function Avatar({
  src = "",
  fallback = defaultFallbackImage,
  fallbackText = "",
  alt = "Avatar",
  size = "md",
  color = "gray",
}: AvatarProps) {
  // Get dimension value for Next.js Image based on size
  const getDimension = () => {
    switch (size) {
      case "sm":
        return 32;
      case "md":
        return 48;
      case "lg":
        return 64;
      case "xl":
        return 80;
      default:
        return 48;
    }
  };

  const dimension = getDimension();
  // In the Avatar component:

  // Add this state to track image loading errors
  const [imageError, setImageError] = useState(false);
  // Then update the rendering logic
  return (
    <RadixAvatar.Root className={rootStyles({ size, color })}>
      {src && !imageError ? (
        <RadixAvatar.Image
          src={src}
          alt={alt}
          onLoadingStatusChange={(status) => {
            if (status === "error") setImageError(true);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <RadixAvatar.Fallback delayMs={0}>
          {fallbackText ? (
            <div className={fallbackStyles({ size, color })}>
              {fallbackText.substring(0, 2).toUpperCase()}
            </div>
          ) : fallback ? (
            <div className="relative h-full w-full">
              <Image
                src={fallback}
                alt={alt}
                width={300}
                height={300}
                className="object-cover"
                sizes={`${dimension}px`}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="relative h-full w-full">
              <Image
                width={300}
                height={300}
                src={defaultFallbackImage}
                alt={alt}
                className="object-cover"
                sizes={`${dimension}px`}
              />
            </div>
          )}
        </RadixAvatar.Fallback>
      )}
    </RadixAvatar.Root>
  );
}

export default Avatar;
