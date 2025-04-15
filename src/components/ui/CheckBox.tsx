import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { tv } from "tailwind-variants";
import { ComponentProps } from "react";
import { FiCheck } from "react-icons/fi";

const checkbox = tv({
  slots: {
    root: "bg-brand-accent text-brand-main flex h-6 w-6 items-center justify-center rounded-[10px] transition-colors",
    indicator: "",
  },
  variants: {
    size: {
      small: {
        root: "h-4 w-4",
        indicator: "h-2 w-2",
      },
      default: {
        root: "h-5 w-5",
        indicator: "h-3 w-3",
      },
      large: {
        root: "h-7 w-7",
        indicator: "h-5 w-5",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface CheckboxProps extends ComponentProps<typeof RadixCheckbox.Root> {
  size?: "default" | "small" | "large";
}

const Checkbox = ({ size, className, ...props }: CheckboxProps) => {
  const { root, indicator } = checkbox({ size });

  return (
    <RadixCheckbox.Root className={root({ className })} {...props}>
      <RadixCheckbox.Indicator className={indicator()} asChild>
        <FiCheck />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
