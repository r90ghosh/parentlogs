import { LogoIcon } from '@/components/ui/logo'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LogoIcon size="xl" className="animate-pulse" />
      <p className="text-sm font-ui text-[--muted] animate-pulse">Loading...</p>
    </div>
  )
}
