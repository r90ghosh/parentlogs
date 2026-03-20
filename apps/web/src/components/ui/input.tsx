import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "font-body placeholder:text-[--muted] selection:bg-copper/20 selection:text-[--cream] border-[--border] h-9 w-full min-w-0 rounded-[--radius-sm] border bg-[--card] px-3 py-1 text-base text-[--cream] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[--cream] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-copper focus-visible:ring-2 focus-visible:ring-copper/30",
        "aria-invalid:border-coral aria-invalid:ring-2 aria-invalid:ring-coral/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
