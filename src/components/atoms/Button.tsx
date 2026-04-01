import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center m-1 rounded-full max-w-full hover:cursor-pointer hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] leading-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-background border-none font-medium",
        dashed:
          "gap-2 border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
        text: "bg-transparent border-none hover:underline",
      },
      size: {
        default: "h-9 px-4",
        dashed: "h-9 px-4",
        text: "h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { icon?: string };

const Button = ({
  variant,
  size,
  className = "",
  icon,
  children,
  ...props
}: ButtonProps) => {
  const iconClassName = icon ? `mgc_${icon}` : undefined;
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {iconClassName && <i className={`${iconClassName} inline-block mr-1`} />}
      {children}
    </button>
  );
};

export default Button;
