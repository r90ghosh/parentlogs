import * as React from "react"

import { cn } from "@/lib/utils/index"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "font-body border-[--border] placeholder:text-[--muted] focus-visible:border-copper focus-visible:ring-2 focus-visible:ring-copper/30 aria-invalid:ring-2 aria-invalid:ring-coral/20 aria-invalid:border-coral bg-[--card] text-[--cream] flex field-sizing-content min-h-16 w-full rounded-[--radius-sm] border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
