"use client";

import * as Label from "@radix-ui/react-label"; // Fixed import
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { tv, type VariantProps } from "tailwind-variants";

// Define the styles with the requested variants
const styles = tv({
  slots: {
    container: "flex gap-5 overflow-hidden",
    iconContainer: "flex flex-shrink-0 flex-grow-0 items-center justify-center",
    wrapper: "flex flex-col",
    label: "tracking-[1px] uppercase",
    input: "text-dark-3 w-full border-b transition-colors focus:outline-none",
    errorMessage: "text-error min-h-[1.3rem] text-[14px]",
  },
  variants: {
    error: {
      true: {
        label: "text-error",
        iconContainer: "text-error bg-error-3",
        input: "border-error focus:border-error",
      },
      false: {},
    },
    variant: {
      primary: {
        label: "text-brand-main",
        iconContainer: "bg-brand-accent text-brand-main",
        input: "caret-brand-main border-b-dark-2/29",
      },
      secondary: {
        label: "text-dark-1",
        iconContainer: "text-brand-main bg-[#F4F9F9]",
        input: "caret-brand-main border-b-dark-2/29",
      },
    },
    size: {
      md: {
        iconContainer: "size-16 rounded-2xl text-2xl",
        label: "mt-1 mb-3 text-[14px]",
        input: "text-body-normal border-b-[2px] pb-2",
        errorMessage: "h-2.8 block text-[14px]",
      },

      sm: {
        iconContainer: "size-8 rounded-md",
        label: "text-[11px] font-medium",
        input: "text-[13px]",
        wrapper: "gap-1",
        errorMessage: "h-2.8 block text-[11px]",
      },
    },
  },
  compoundVariants: [
    {
      error: true,
      variant: "primary",
      class: {
        label: "!text-error",
        iconContainer: "!bg-error-3 !text-error",
        input: "!border-error focus:!border-error",
      },
    },
    {
      error: true,
      variant: "secondary",
      class: {
        label: "text-error",
        iconContainer: "bg-error-3 text-error",
      },
    },
  ],
  defaultVariants: {
    error: false,
    variant: "primary",
    size: "md",
  },
});

type InputStylesVariants = VariantProps<typeof styles>;

interface CommonProps {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
  icon: React.ReactNode;
  error?: FieldError;
  className?: string;
  fullWidth?: boolean;
  variant?: InputStylesVariants["variant"];
  size?: InputStylesVariants["size"];
  iconClassName?: string;
}

// Input-specific props
type InputProps = CommonProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

// Textarea-specific props
type TextareaProps = CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

// Combined props with type discriminator
type InputFieldProps =
  | (InputProps & { type?: string })
  | (TextareaProps & { type: "textarea" });

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  className = "",
  labelClassName: labelClassNameProps = "",
  inputClassName = "",
  iconClassName = "",
  fullWidth = false,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const {
    container,
    label: labelClass,
    wrapper,
    iconContainer,
    input,
    errorMessage,
  } = styles({
    error: !!error,
    variant,
    size,
  });

  const isTextarea = props.type === "textarea";

  return (
    <div
      className={container({
        className: `${className} ${fullWidth ? "w-full" : "max-w-xl"}`,
      })}
    >
      <div className={iconContainer({ className: iconClassName })}>{icon}</div>
      <div className={`${wrapper()} w-full`}>
        <Label.Root className={labelClass({ className: labelClassNameProps })}>
          {label}
        </Label.Root>

        {isTextarea ? (
          <textarea
            className={input({ className: inputClassName })}
            aria-invalid={!!error}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={input({ className: inputClassName })}
            aria-invalid={!!error}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        <div className={errorMessage()}>{error ? error.message : ""}</div>
      </div>
    </div>
  );
};

export default InputField;
