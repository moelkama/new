import Image from "next/image";
import { tv } from "tailwind-variants";

const sizeDimensions = {
  sm: { width: 84, height: 84 },
  m: { width: 200, height: 200 },
  lg: { width: 270, height: 270 },
};

const logoStyles = tv({
  base: "relative overflow-hidden",
  variants: {
    size: {
      sm: "h-[84px] w-[84px]",
      m: "h-[200px] w-[200px]",
      lg: "h-[270px] w-[270px]",
    },
  },
  defaultVariants: {
    size: "m",
  },
});

// Props interface
interface RestaurantLogoProps {
  url: string;
  size?: "sm" | "m" | "lg";
  alt?: string;
  className?: string;
  isPriority?: boolean;
}

const RestaurantLogo = ({
  url,
  size = "m",
  alt = "Restaurant Logo",
  className,
  isPriority = true,
}: RestaurantLogoProps) => {
  const dimensions = sizeDimensions[size];

  const containerClass = logoStyles({ size, className });

  return (
    <div className={containerClass}>
      <Image
        src={url}
        alt={alt}
        fill={true}
        sizes={`(max-width: 768px) ${dimensions.width}px, ${dimensions.width}px`}
        className="object-contain"
        priority={isPriority}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2Q4tgqwAAAABJRU5ErkJggg=="
      />
    </div>
  );
};

export default RestaurantLogo;
