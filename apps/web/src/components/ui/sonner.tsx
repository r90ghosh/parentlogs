"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-sage" />,
        info: <InfoIcon className="size-4 text-sky" />,
        warning: <TriangleAlertIcon className="size-4 text-gold" />,
        error: <OctagonXIcon className="size-4 text-coral" />,
        loading: <Loader2Icon className="size-4 animate-spin text-[--muted]" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--cream)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--card)",
          "--success-text": "var(--cream)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--card)",
          "--error-text": "var(--cream)",
          "--error-border": "var(--border)",
          "--toast-shadow": "var(--shadow-card)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
