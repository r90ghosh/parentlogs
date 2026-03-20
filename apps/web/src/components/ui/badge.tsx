import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-ui font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-copper/30 bg-copper-dim text-copper",
        secondary:
          "border-gold/30 bg-gold-dim text-gold",
        destructive:
          "border-coral/30 bg-coral-dim text-coral",
        outline:
          "border-[--border] bg-transparent text-[--cream]",
        sage:
          "border-sage/30 bg-sage-dim text-sage",
        muted:
          "border-[--dim] bg-[--dim]/30 text-[--muted]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
