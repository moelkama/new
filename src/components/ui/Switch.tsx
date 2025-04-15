import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { tv } from "tailwind-variants";

const switchStyles = tv({
  slots: {
    root: "focus:ring-primary-400 relative inline-flex items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
    thumb:
      "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform",
  },
  variants: {
    size: {
      small: {
        root: "h-[22px] w-[36px]",
        thumb:
          "h-[18px] w-[18px] data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]",
      },
      medium: {
        root: "h-[24px] w-[44px]",
        thumb:
          "h-[20px] w-[20px] data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]",
      },
      large: {
        root: "h-[30px] w-[56px]",
        thumb:
          "h-[26px] w-[26px] data-[state=checked]:translate-x-[28px] data-[state=unchecked]:translate-x-[2px]",
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: "small" | "medium" | "large";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ size, className, ...props }, ref) => {
  const { root, thumb } = switchStyles({ size });

  return (
    <div className="flex justify-center">
      <SwitchPrimitive.Root
        className={root({ className })}
        style={{
          backgroundColor: props.checked
            ? "var(--primary-color, #37afb6)"
            : "var(--gray-300, #d1d5db)",
        }}
        {...props}
        ref={ref}
      >
        <SwitchPrimitive.Thumb className={thumb()} />
      </SwitchPrimitive.Root>
    </div>
  );
});

Switch.displayName = "Switch";

export default Switch;
