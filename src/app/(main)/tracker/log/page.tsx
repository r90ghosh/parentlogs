'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateLog } from '@/hooks/use-tracker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { LogType } from '@/services/tracker-service'

function LogEntryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const createLog = useCreateLog()

  const logType = (searchParams.get('type') || 'feeding') as LogType

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString().slice(0, 16))
  const [notes, setNotes] = useState('')

  // Type-specific fields
  const [feedingType, setFeedingType] = useState<'breast' | 'bottle' | 'solid'>('breast')
  const [feedingSide, setFeedingSide] = useState<'left' | 'right' | 'both'>('left')
  const [feedingAmount, setFeedingAmount] = useState('')
  const [feedingDuration, setFeedingDuration] = useState('')

  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet')

  const [sleepDuration, setSleepDuration] = useState('')
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good')

  const [temperature, setTemperature] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState<'F' | 'C'>('F')

  const [medicineName, setMedicineName] = useState('')
  const [medicineDosage, setMedicineDosage] = useState('')

  const [moodLevel, setMoodLevel] = useState<1 | 2 | 3 | 4 | 5>(3)

  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs')

  const [height, setHeight] = useState('')
  const [heightUnit, setHeightUnit] = useState<'in' | 'cm'>('in')

  const [milestoneName, setMilestoneName] = useState('')

  const [customType, setCustomType] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const details: Record<string, any> = {}

    switch (logType) {
      case 'feeding':
        details.type = feedingType
        if (feedingType === 'breast') {
          details.side = feedingSide
          details.duration_minutes = parseInt(feedingDuration) || 0
        } else {
          details.amount_oz = parseFloat(feedingAmount) || 0
        }
        break
      case 'diaper':
        details.type = diaperType
        break
      case 'sleep':
        details.duration_minutes = parseInt(sleepDuration) || 0
        details.quality = sleepQuality
        break
      case 'temperature':
        details.value = parseFloat(temperature) || 0
        details.unit = temperatureUnit
        break
      case 'medicine':
        details.name = medicineName
        details.dosage = medicineDosage
        break
      case 'vitamin_d':
        details.given = true
        break
      case 'mood':
        details.level = moodLevel
        break
      case 'weight':
        details.value = parseFloat(weight) || 0
        details.unit = weightUnit
        break
      case 'height':
        details.value = parseFloat(height) || 0
        details.unit = heightUnit
        break
      case 'milestone':
        details.name = milestoneName
        break
      case 'custom':
        details.type = customType
        break
    }

    const result = await createLog.mutateAsync({
      log_type: logType,
      logged_at: new Date(loggedAt).toISOString(),
      notes: notes || undefined,
      log_data: details,
    })

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error.message,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Log saved!' })
      router.push('/tracker')
    }
  }

  const getTitle = () => {
    const titles: Record<LogType, string> = {
      feeding: 'Log Feeding',
      diaper: 'Log Diaper',
      sleep: 'Log Sleep',
      temperature: 'Log Temperature',
      medicine: 'Log Medicine',
      vitamin_d: 'Log Vitamin D',
      mood: 'Log Mood',
      weight: 'Log Weight',
      height: 'Log Height',
      milestone: 'Log Milestone',
      custom: 'Custom Log',
    }
    return titles[logType] || 'Log Entry'
  }

  return (
    <div className="p-4 md:ml-64 space-y-4 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tracker">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">{getTitle()}</h1>
      </div>

      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6 space-y-4">
          {/* Time */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="datetime-local"
              value={loggedAt}
              onChange={(e) => setLoggedAt(e.target.value)}
              className="bg-surface-800 border-surface-700"
            />
          </div>

          {/* Type-specific fields */}
          {logType === 'feeding' && (
            <>
              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup
                  value={feedingType}
                  onValueChange={(v) => setFeedingType(v as any)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="breast" id="breast" />
                    <Label htmlFor="breast">Breast</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottle" id="bottle" />
                    <Label htmlFor="bottle">Bottle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="solid" />
                    <Label htmlFor="solid">Solid</Label>
                  </div>
                </RadioGroup>
              </div>

              {feedingType === 'breast' && (
                <>
                  <div className="space-y-2">
                    <Label>Side</Label>
                    <RadioGroup
                      value={feedingSide}
                      onValueChange={(v) => setFeedingSide(v as any)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="left" />
                        <Label htmlFor="left">Left</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="right" />
                        <Label htmlFor="right">Right</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={feedingDuration}
                      onChange={(e) => setFeedingDuration(e.target.value)}
                      placeholder="15"
                      className="bg-surface-800 border-surface-700"
                    />
                  </div>
                </>
              )}

              {(feedingType === 'bottle' || feedingType === 'solid') && (
                <div className="space-y-2">
                  <Label>Amount (oz)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={feedingAmount}
                    onChange={(e) => setFeedingAmount(e.target.value)}
                    placeholder="4"
                    className="bg-surface-800 border-surface-700"
                  />
                </div>
              )}
            </>
          )}

          {logType === 'diaper' && (
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={diaperType}
                onValueChange={(v) => setDiaperType(v as any)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wet" id="wet" />
                  <Label htmlFor="wet">Wet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dirty" id="dirty" />
                  <Label htmlFor="dirty">Dirty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="diaper-both" />
                  <Label htmlFor="diaper-both">Both</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {logType === 'sleep' && (
            <>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(e.target.value)}
                  placeholder="60"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={sleepQuality} onValueChange={(v) => setSleepQuality(v as any)}>
                  <SelectTrigger className="bg-surface-800 border-surface-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {logType === 'temperature' && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label>Temperature</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="98.6"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>Unit</Label>
                <Select value={temperatureUnit} onValueChange={(v) => setTemperatureUnit(v as any)}>
                  <SelectTrigger className="bg-surface-800 border-surface-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">°F</SelectItem>
                    <SelectItem value="C">°C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {logType === 'medicine' && (
            <>
              <div className="space-y-2">
                <Label>Medicine Name</Label>
                <Input
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Tylenol"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input
                  value={medicineDosage}
                  onChange={(e) => setMedicineDosage(e.target.value)}
                  placeholder="2.5ml"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
            </>
          )}

          {logType === 'mood' && (
            <div className="space-y-2">
              <Label>Mood Level</Label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setMoodLevel(level as any)}
                    className={`w-12 h-12 rounded-full text-2xl transition-all ${
                      moodLevel === level
                        ? 'bg-accent-500 scale-110'
                        : 'bg-surface-800 hover:bg-surface-700'
                    }`}
                  >
                    {level === 1 ? '😢' : level === 2 ? '😕' : level === 3 ? '😐' : level === 4 ? '😊' : '😄'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {logType === 'weight' && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label>Weight</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="12.5"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>Unit</Label>
                <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as any)}>
                  <SelectTrigger className="bg-surface-800 border-surface-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {logType === 'height' && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="24"
                  className="bg-surface-800 border-surface-700"
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>Unit</Label>
                <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as any)}>
                  <SelectTrigger className="bg-surface-800 border-surface-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {logType === 'milestone' && (
            <div className="space-y-2">
              <Label>Milestone</Label>
              <Input
                value={milestoneName}
                onChange={(e) => setMilestoneName(e.target.value)}
                placeholder="First smile"
                className="bg-surface-800 border-surface-700"
              />
            </div>
          )}

          {logType === 'custom' && (
            <div className="space-y-2">
              <Label>Log Type</Label>
              <Input
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Bath time"
                className="bg-surface-800 border-surface-700"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className="bg-surface-800 border-surface-700"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Log'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LogEntryPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:ml-64 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
      </div>
    }>
      <LogEntryContent />
    </Suspense>
  )
}
