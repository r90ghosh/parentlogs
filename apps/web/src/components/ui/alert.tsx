import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[--radius] border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current font-body",
  {
    variants: {
      variant: {
        default:
          "bg-copper-dim border-l-2 border-l-copper border-[--border] text-[--cream] [&>svg]:text-copper",
        destructive:
          "bg-coral-dim border-l-2 border-l-coral border-[--border] text-coral [&>svg]:text-coral *:data-[slot=alert-description]:text-coral/90",
        info:
          "bg-[--card] border-[--border] text-[--cream] [&>svg]:text-[--muted]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight font-ui text-[--cream]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-[--muted] col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed font-body",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
