'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Moon, Sun, Monitor, Type, Check } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Theme = 'dark' | 'light' | 'system'
type FontSize = 'small' | 'medium' | 'large'
type AccentColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink'

const accentColors: { value: AccentColor; label: string; class: string }[] = [
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
]

export default function AppearanceSettingsPage() {
  const { toast } = useToast()

  // Load settings from localStorage
  const [theme, setTheme] = useState<Theme>('dark')
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [accentColor, setAccentColor] = useState<AccentColor>('purple')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedFontSize = localStorage.getItem('fontSize') as FontSize
    const savedAccent = localStorage.getItem('accentColor') as AccentColor
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true'
    const savedCompactMode = localStorage.getItem('compactMode') === 'true'

    if (savedTheme) setTheme(savedTheme)
    if (savedFontSize) setFontSize(savedFontSize)
    if (savedAccent) setAccentColor(savedAccent)
    setReducedMotion(savedReducedMotion)
    setCompactMode(savedCompactMode)
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    // Apply theme to document
    const root = document.documentElement
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemDark)
    } else {
      root.classList.toggle('dark', newTheme === 'dark')
    }

    toast({ title: 'Theme updated' })
  }

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize)
    localStorage.setItem('fontSize', newSize)

    // Apply font size to document
    const root = document.documentElement
    root.classList.remove('text-sm', 'text-base', 'text-lg')
    if (newSize === 'small') root.style.fontSize = '14px'
    else if (newSize === 'large') root.style.fontSize = '18px'
    else root.style.fontSize = '16px'

    toast({ title: 'Font size updated' })
  }

  const handleAccentChange = (newAccent: AccentColor) => {
    setAccentColor(newAccent)
    localStorage.setItem('accentColor', newAccent)
    toast({ title: 'Accent color updated' })
  }

  const handleReducedMotionChange = (enabled: boolean) => {
    setReducedMotion(enabled)
    localStorage.setItem('reducedMotion', String(enabled))

    // Apply reduced motion
    const root = document.documentElement
    root.classList.toggle('reduce-motion', enabled)

    toast({ title: enabled ? 'Reduced motion enabled' : 'Animations enabled' })
  }

  const handleCompactModeChange = (enabled: boolean) => {
    setCompactMode(enabled)
    localStorage.setItem('compactMode', String(enabled))
    toast({ title: enabled ? 'Compact mode enabled' : 'Normal mode enabled' })
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Appearance</h1>
      </div>

      {/* Theme */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(v) => handleThemeChange(v as Theme)}>
            <div className="grid grid-cols-3 gap-4">
              <Label
                htmlFor="theme-dark"
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === 'dark'
                    ? "border-accent-500 bg-accent-500/10"
                    : "border-surface-700 hover:border-surface-600"
                )}
              >
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <Moon className="h-6 w-6 text-surface-300" />
                <span className="text-sm text-white">Dark</span>
              </Label>

              <Label
                htmlFor="theme-light"
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === 'light'
                    ? "border-accent-500 bg-accent-500/10"
                    : "border-surface-700 hover:border-surface-600"
                )}
              >
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <Sun className="h-6 w-6 text-surface-300" />
                <span className="text-sm text-white">Light</span>
              </Label>

              <Label
                htmlFor="theme-system"
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === 'system'
                    ? "border-accent-500 bg-accent-500/10"
                    : "border-surface-700 hover:border-surface-600"
                )}
              >
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <Monitor className="h-6 w-6 text-surface-300" />
                <span className="text-sm text-white">System</span>
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-surface-500 mt-3">
            Note: Light mode is coming soon. Currently optimized for dark mode.
          </p>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg">Accent Color</CardTitle>
          <CardDescription>Personalize the app with your favorite color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentChange(color.value)}
                className={cn(
                  "relative h-10 w-10 rounded-full transition-transform hover:scale-110",
                  color.class,
                  accentColor === color.value && "ring-2 ring-offset-2 ring-offset-surface-900 ring-white"
                )}
                title={color.label}
              >
                {accentColor === color.value && (
                  <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-surface-500 mt-3">
            Note: Custom accent colors are coming soon.
          </p>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription>Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={fontSize} onValueChange={(v) => handleFontSizeChange(v as FontSize)}>
            <SelectTrigger className="bg-surface-800 border-surface-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium (Default)</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>

          {/* Preview */}
          <div className="mt-4 p-4 bg-surface-800/50 rounded-lg">
            <p className="text-surface-400 text-xs mb-2">Preview:</p>
            <p
              className="text-white"
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
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg">Accessibility</CardTitle>
          <CardDescription>Make the app more comfortable to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduced Motion</Label>
              <p className="text-xs text-surface-400">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={handleReducedMotionChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Compact Mode</Label>
              <p className="text-xs text-surface-400">Reduce spacing for more content on screen</p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={handleCompactModeChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleThemeChange('dark')
              handleFontSizeChange('medium')
              handleAccentChange('purple')
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
