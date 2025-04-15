import React from "react";
import { tv, VariantProps } from "tailwind-variants";

// Wrapper variants
const iconWrapperVariants = tv({
  base: "inline-flex items-center justify-center",
  variants: {
    size: {
      none: "",
      sm: "size-8 rounded-[8px]",
      md: "size-12 rounded-[10px]",
      lg: "size-16 rounded-2xl",
      xl: "size-[155px] rounded-3xl",
    },
    variant: {
      none: "",
      primary: "text-brand-main bg-brand-accent",
      secondary: "text-brand-accent bg-brand-[#F4F9F9]",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "none",
  },
});

// Icon variants with more color options
const iconVariants = tv({
  base: "",
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6", //24
      xl: "size-[88px]",
    },
    color: {
      inherit: "text-current", // Inherit from parent
      primary: "text-brand-main",
      secondary: "text-brand-accent",
      white: "text-white",
      dark: "text-dark-1",
    },
  },
  defaultVariants: {
    size: "md",
    color: "inherit", // Default to inheriting color
  },
});

type IconVariantProps = VariantProps<typeof iconVariants>;
type WrapperVariantProps = VariantProps<typeof iconWrapperVariants>;

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Required props
  as: React.ElementType;

  wrapperSize?: WrapperVariantProps["size"];
  wrapperVariant?: WrapperVariantProps["variant"];
  wrapperClassName?: string;

  iconSize?: IconVariantProps["size"];
  iconColor?: IconVariantProps["color"];
  iconClassName?: string;
}

const Icon: React.FC<IconProps> = ({
  as: IconComponent,

  wrapperSize = "md",
  wrapperVariant = "none",
  wrapperClassName,

  iconSize,
  iconColor = "inherit",
  iconClassName,

  className,
  ...props
}) => {
  const resolveIconSize = (): IconVariantProps["size"] => {
    if (iconSize) return iconSize;
    if (wrapperSize === "none") return "md";
    return wrapperSize === "sm" ||
      wrapperSize === "md" ||
      wrapperSize === "lg" ||
      wrapperSize === "xl"
      ? wrapperSize
      : "md";
  };

  return (
    <span
      className={iconWrapperVariants({
        size: wrapperSize,
        variant: wrapperVariant,
        className: wrapperClassName || className,
      })}
      {...props}
    >
      <IconComponent
        className={iconVariants({
          size: resolveIconSize(),
          color: iconColor,
          className: iconClassName,
        })}
      />
    </span>
  );
};

export default Icon;
