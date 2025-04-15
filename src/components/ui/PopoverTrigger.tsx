"use client";

import { ReactNode, forwardRef } from "react";
import { tv } from "tailwind-variants";
import { LuChevronsUpDown } from "react-icons/lu";

const styles = tv({
  slots: {
    base: "flex w-fit cursor-pointer items-center justify-baseline gap-6 p-2",
    leftIcon: "text-brand-main mt-0.5 flex h-6 w-6 items-center justify-center",
    text: "text-sm font-medium",
    rightIcon: "mt-0.5 h-4 w-4 items-center justify-center",
  },

  variants: {
    variant: {
      default: "",
      primary: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PopoverTriggerProps {
  icon: ReactNode;
  text: string;
  variant?: "default" | "primary";
  className?: string;
  onClick?: () => void;
}

const PopoverTrigger = forwardRef<HTMLDivElement, PopoverTriggerProps>(
  ({ icon, text, variant, className, onClick, ...props }, ref) => {
    const { base, leftIcon, text: textStyle, rightIcon } = styles({ variant });

    return (
      <div
        ref={ref}
        className={base({ className })}
        onClick={onClick}
        {...props}
      >
        <span className={leftIcon()}>{icon}</span>
        <span className={textStyle()}>{text}</span>
        <LuChevronsUpDown size={24} className={rightIcon()} />
      </div>
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

export default PopoverTrigger;
