import React from "react";
import { Image, Transformation } from "@imagekit/next";
import { IMAGEKIT_CONFIG } from "@/lib/imagekit";

interface ImageKitProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transformation?: Transformation[];
}

const ImageKitImage: React.FC<ImageKitProps> = ({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  transformation = []
}) => {
  // Don't render if no src
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <Image
      urlEndpoint={IMAGEKIT_CONFIG.urlEndpoint}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      transformation={transformation}
      loading="lazy"
    />
  );
};

export default ImageKitImage;
