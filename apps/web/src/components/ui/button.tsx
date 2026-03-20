import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/index"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-ui font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-copper/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[--bg] aria-invalid:border-coral",
  {
    variants: {
      variant: {
        default:
          "bg-copper text-[--bg] hover:bg-copper-hover shadow-copper font-semibold tracking-wide",
        destructive:
          "bg-coral text-[--white] hover:bg-coral/90 focus-visible:ring-coral/30",
        outline:
          "border border-[--border] text-[--cream] hover:border-[--border-hover] bg-transparent hover:bg-[--card-hover]",
        secondary:
          "bg-transparent border border-copper text-copper hover:bg-copper hover:text-[--bg] font-semibold tracking-wide",
        gold:
          "bg-gold text-[--bg] hover:bg-gold-hover shadow-gold font-semibold tracking-wide",
        ghost:
          "text-[--muted] hover:text-[--cream] hover:bg-transparent bg-transparent",
        link: "text-copper underline-offset-4 hover:text-gold hover:underline bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
