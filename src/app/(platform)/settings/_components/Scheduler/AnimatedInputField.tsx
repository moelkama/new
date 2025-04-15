import React, { useState, ChangeEvent } from "react";
import { tv } from "tailwind-variants";
import { IoTimeOutline } from "react-icons/io5"; // Import the clock icon

const animatedInput = tv({
  base: "w-full rounded-md border-[0.5px] border-[#BFBFBF] bg-transparent px-4 py-1 pr-9 text-[12px] transition-colors duration-300 outline-none", // added right padding for icon
  variants: {
    focused: {
      true: "",
      false: "",
    },
    error: {
      true: "border-red-500",
      false: "border-[#BFBFBF]",
    },
  },
  compoundVariants: [
    {
      focused: true,
      error: false,
      class: "border-brand-main",
    },
  ],
});

const animatedLabel = tv({
  base: "pointer-events-none absolute left-2 bg-white px-2 transition-all duration-300",
  variants: {
    active: {
      true: "top-[-8] text-[10px]",
      false: "top-1/2 -translate-y-1/2 transform text-[12px]",
    },
    error: {
      true: "text-red-500",
      false: "",
    },
  },
});

interface AnimatedInputFieldProps {
  id: string;
  type?: string;
  value: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

const AnimatedInputField: React.FC<AnimatedInputFieldProps> = ({
  id,
  type = "text",
  value,
  label,
  onChange,
  error = false,
  //   errorMessage = "",
  placeholder = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value !== "";

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        spellCheck="false"
        required
        placeholder={placeholder}
        className={animatedInput({ focused: isFocused, error })}
      />
      <label
        htmlFor={id}
        className={animatedLabel({ active: isActive, error })}
      >
        {label}
      </label>

      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#737373]">
        <IoTimeOutline size={16} />
      </div>

      {/* {error && errorMessage && (
        <div className="absolute -bottom-5 left-0 text-[10px] text-red-500">
          {errorMessage}
        </div>
      )} */}
    </div>
  );
};

export default AnimatedInputField;
