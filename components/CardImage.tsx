import Image from "next/image";

interface CardImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  objectFit?: "cover" | "contain";
  className?: string;
}

// Tamaños predefinidos para fácil modificación
const IMAGE_SIZES = {
  sm: "h-16 w-16", // 64x64px
  md: "h-24 w-24", // 96x96px
  lg: "h-32 w-32", // 128x128px
  xl: "h-40 w-40", // 160x160px
};

export default function CardImage({
  src,
  alt,
  size = "md",
  objectFit = "cover",
  className = "",
}: CardImageProps) {
  const sizeClasses = IMAGE_SIZES[size];
  const objectFitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  return (
    <div
      className={`${sizeClasses} shrink-0 overflow-hidden rounded-lg ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={size === "sm" ? 64 : size === "md" ? 96 : size === "lg" ? 128 : 160}
        height={size === "sm" ? 64 : size === "md" ? 96 : size === "lg" ? 128 : 160}
        className={`w-full h-full ${objectFitClass}`}
        unoptimized
      />
    </div>
  );
}
