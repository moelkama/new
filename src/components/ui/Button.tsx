import { tv, type VariantProps } from "tailwind-variants";
import { IconType } from "react-icons";
import { ReactNode, forwardRef } from "react";
import Link from "next/link";

const button = tv({
  base: "inline-flex cursor-pointer items-center text-center font-normal transition-colors duration-400 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary:
        "bg-brand-main hover:bg-brand-main/60 text-white disabled:bg-[#C8DEE0]",
      secondary:
        "text-brand-main bg-brand-accent border-brand-accent active:bg-brand-accent border-1 hover:border-[#D7DBEC] hover:bg-white active:text-white disabled:bg-[#E6E0C8]",
      destructive:
        "bg-brand-secondary text-white hover:bg-[#FFEBA2] disabled:bg-[#E6E0C8]",
      secondaryDestructive: "text-brand-secondary bg-[#FFF6D3]",
    },
    size: {
      lg: "gap-2 rounded-xl px-4 py-5 text-base",
      md: "gap-1.5 rounded-[8px] px-3 py-2 text-sm",
      sm: "gap-1 rounded-[4px] px-2 py-1 text-xs",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-xl",
      lg: "",
      full: "rounded-full",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      between: "justify-between",
      end: "justify-end",
    },
    fullWidth: {
      true: "w-full",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },

  defaultVariants: {
    size: "md",
    variant: "primary",
    rounded: "md",
    justify: "center",
  },
});

// Base props common to both button and link
interface BaseButtonProps extends VariantProps<typeof button> {
  leftIcon?: IconType | ReactNode;
  rightIcon?: IconType | ReactNode;
  iconSize?: number;
  loader?: boolean;
  children?: ReactNode;
  className?: string;
}

// For the native button branch, we omit overlapping keys and override the "type" prop.
type ButtonAsButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

// For the link branch, we omit overlapping keys.
type ButtonAsLinkProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size,
      href,
      variant,
      rounded,
      justify,
      fullWidth,
      disabled,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconSize,
      className,
      // Destructure type with a default value.
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const renderIcon = (icon: IconType | ReactNode) => {
      if (!icon) return null;
      if (typeof icon === "function") {
        const Icon = icon as IconType;
        const computedSize =
          iconSize ?? (size === "lg" ? 24 : size === "md" ? 20 : 16);
        return (
          <Icon
            className="shrink-0"
            style={{ height: computedSize, width: computedSize }}
          />
        );
      }
      return icon;
    };

    if (href) {
      // For links, assume the remaining props are anchor attributes.
      const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <Link
          href={href}
          className={button({
            size,
            variant,
            rounded,
            justify,
            fullWidth,
            disabled,
            className,
          })}
          {...anchorProps}
        >
          {LeftIcon && renderIcon(LeftIcon)}
          {children}
          {RightIcon && renderIcon(RightIcon)}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        // Explicitly cast type as the literal union.
        type={type as "button" | "submit" | "reset"}
        disabled={disabled}
        className={button({
          size,
          variant,
          rounded,
          justify,
          fullWidth,
          disabled,
          className,
        })}
        {...(rest as Omit<
          React.ButtonHTMLAttributes<HTMLButtonElement>,
          "type"
        >)}
      >
        {LeftIcon && renderIcon(LeftIcon)}
        {children}
        {RightIcon && renderIcon(RightIcon)}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
