import { cva, type VariantProps } from "class-variance-authority";
import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
      outline: "border border-current bg-transparent hover:bg-foreground/5",
      ghost: "bg-transparent hover:bg-foreground/10",
      dark: "bg-foreground text-background hover:opacity-80",
    },
    size: {
      default: "min-h-12 px-6 text-sm",
      large: "min-h-15 px-8 text-base",
      icon: "size-11 shrink-0",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant, size, asChild = false, children, ...props }, ref) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...props, className: cn(classes, child.props.className) });
  }
  return <button ref={ref} className={classes} {...props}>{children}</button>;
});