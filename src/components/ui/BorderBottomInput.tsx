import React from "react";

export const BorderBottomInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className="ring-offset-background placeholder:text-muted-foreground flex w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-teal-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
});
BorderBottomInput.displayName = "BorderBottomInput";
