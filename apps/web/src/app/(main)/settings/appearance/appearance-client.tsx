'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Moon, Sun, Monitor, Type } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type FontSize = 'small' | 'medium' | 'large'

export default function AppearanceClient() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedFontSize = localStorage.getItem('fontSize') as FontSize
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true'
    const savedCompactMode = localStorage.getItem('compactMode') === 'true'

    if (savedFontSize) setFontSize(savedFontSize)
    setReducedMotion(savedReducedMotion)
    setCompactMode(savedCompactMode)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast({ title: 'Theme updated' })
  }

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize)
    localStorage.setItem('fontSize', newSize)

    const root = document.documentElement
    root.classList.remove('text-sm', 'text-base', 'text-lg')
    if (newSize === 'small') root.style.fontSize = '14px'
    else if (newSize === 'large') root.style.fontSize = '18px'
    else root.style.fontSize = '16px'

    toast({ title: 'Font size updated' })
  }

  const handleReducedMotionChange = (enabled: boolean) => {
    setReducedMotion(enabled)
    localStorage.setItem('reducedMotion', String(enabled))

    const root = document.documentElement
    root.classList.toggle('reduce-motion', enabled)

    toast({ title: enabled ? 'Reduced motion enabled' : 'Animations enabled' })
  }

  const handleCompactModeChange = (enabled: boolean) => {
    setCompactMode(enabled)
    localStorage.setItem('compactMode', String(enabled))
    toast({ title: enabled ? 'Compact mode enabled' : 'Normal mode enabled' })
  }

  // Avoid hydration mismatch — don't render theme-dependent UI until mounted
  const currentTheme = mounted ? theme : 'dark'

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-display text-xl font-bold text-[--white]">Appearance</h1>
      </div>

      {/* Theme */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Theme</CardTitle>
          <CardDescription className="font-body">Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'system', label: 'System', icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  currentTheme === value
                    ? "border-copper bg-copper/10"
                    : "border-[--border-hover] hover:border-copper/40"
                )}
              >
                <Icon className="h-6 w-6 text-[--cream]" />
                <span className="font-body text-sm text-[--white]">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription className="font-body">Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={fontSize} onValueChange={(v) => handleFontSizeChange(v as FontSize)}>
            <SelectTrigger className="bg-[--card] border-[--border]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium (Default)</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>

          {/* Preview */}
          <div className="mt-4 p-4 bg-[--card]/50 rounded-lg">
            <p className="font-ui text-[--muted] text-xs mb-2">Preview:</p>
            <p
              className="font-body text-[--white]"
              style={{
                fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px'
              }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Accessibility</CardTitle>
          <CardDescription className="font-body">Make the app more comfortable to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-ui font-medium">Reduced Motion</Label>
              <p className="font-body text-xs text-[--muted]">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={handleReducedMotionChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-ui font-medium">Compact Mode</Label>
              <p className="font-body text-xs text-[--muted]">Reduce spacing for more content on screen</p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={handleCompactModeChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className="bg-[--surface] border-[--border]">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full font-ui font-semibold"
            onClick={() => {
              handleThemeChange('dark')
              handleFontSizeChange('medium')
              handleReducedMotionChange(false)
              handleCompactModeChange(false)
              toast({ title: 'Settings reset to defaults' })
            }}
          >
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
