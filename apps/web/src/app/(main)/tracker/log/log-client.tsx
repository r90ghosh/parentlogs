'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateLog } from '@/hooks/use-tracker'
import { Panel } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type { LogType } from '@tdc/services'
import { cn } from '@/lib/utils'

const fieldLabel = 'mb-1.5 block text-[12.5px] font-bold uppercase tracking-[0.5px] text-mute'
const fieldInput =
  'w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay'
const chip = 'rounded-full px-[15px] py-2 text-[13px] font-bold transition-colors'

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        chip,
        active ? 'bg-clay text-white' : 'border border-line bg-card text-ink2 hover:border-faint'
      )}
    >
      {children}
    </button>
  )
}

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

  usePageHeader({ title: getTitle() }, [logType])

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

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tracker"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <Panel className="p-[18px] sm:p-[22px]">
        <div className="space-y-5">
          {/* Time */}
          <div>
            <label htmlFor="loggedAt" className={fieldLabel}>
              Time
            </label>
            <input
              id="loggedAt"
              type="datetime-local"
              value={loggedAt}
              onChange={(e) => setLoggedAt(e.target.value)}
              className={fieldInput}
            />
          </div>

          {/* Type-specific fields */}
          {logType === 'feeding' && (
            <>
              <div>
                <span className={fieldLabel}>Type</span>
                <div className="flex flex-wrap gap-2">
                  <Chip active={feedingType === 'breast'} onClick={() => setFeedingType('breast')}>
                    Breast
                  </Chip>
                  <Chip active={feedingType === 'bottle'} onClick={() => setFeedingType('bottle')}>
                    Bottle
                  </Chip>
                  <Chip active={feedingType === 'solid'} onClick={() => setFeedingType('solid')}>
                    Solid
                  </Chip>
                </div>
              </div>

              {feedingType === 'breast' && (
                <>
                  <div>
                    <span className={fieldLabel}>Side</span>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={feedingSide === 'left'} onClick={() => setFeedingSide('left')}>
                        Left
                      </Chip>
                      <Chip active={feedingSide === 'right'} onClick={() => setFeedingSide('right')}>
                        Right
                      </Chip>
                      <Chip active={feedingSide === 'both'} onClick={() => setFeedingSide('both')}>
                        Both
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="feedingDuration" className={fieldLabel}>
                      Duration (minutes)
                    </label>
                    <input
                      id="feedingDuration"
                      type="number"
                      value={feedingDuration}
                      onChange={(e) => setFeedingDuration(e.target.value)}
                      placeholder="15"
                      className={fieldInput}
                    />
                  </div>
                </>
              )}

              {(feedingType === 'bottle' || feedingType === 'solid') && (
                <div>
                  <label htmlFor="feedingAmount" className={fieldLabel}>
                    Amount (oz)
                  </label>
                  <input
                    id="feedingAmount"
                    type="number"
                    step="0.5"
                    value={feedingAmount}
                    onChange={(e) => setFeedingAmount(e.target.value)}
                    placeholder="4"
                    className={fieldInput}
                  />
                </div>
              )}
            </>
          )}

          {logType === 'diaper' && (
            <div>
              <span className={fieldLabel}>Type</span>
              <div className="flex flex-wrap gap-2">
                <Chip active={diaperType === 'wet'} onClick={() => setDiaperType('wet')}>
                  Wet
                </Chip>
                <Chip active={diaperType === 'dirty'} onClick={() => setDiaperType('dirty')}>
                  Dirty
                </Chip>
                <Chip active={diaperType === 'both'} onClick={() => setDiaperType('both')}>
                  Both
                </Chip>
              </div>
            </div>
          )}

          {logType === 'sleep' && (
            <>
              <div>
                <label htmlFor="sleepDuration" className={fieldLabel}>
                  Duration (minutes)
                </label>
                <input
                  id="sleepDuration"
                  type="number"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(e.target.value)}
                  placeholder="60"
                  className={fieldInput}
                />
              </div>
              <div>
                <span className={fieldLabel}>Quality</span>
                <div className="flex flex-wrap gap-2">
                  <Chip active={sleepQuality === 'good'} onClick={() => setSleepQuality('good')}>
                    Good
                  </Chip>
                  <Chip active={sleepQuality === 'fair'} onClick={() => setSleepQuality('fair')}>
                    Fair
                  </Chip>
                  <Chip active={sleepQuality === 'poor'} onClick={() => setSleepQuality('poor')}>
                    Poor
                  </Chip>
                </div>
              </div>
            </>
          )}

          {logType === 'temperature' && (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="temperature" className={fieldLabel}>
                    Temperature
                  </label>
                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="98.6"
                    className={fieldInput}
                  />
                </div>
                <div className="w-28">
                  <span className={fieldLabel}>Unit</span>
                  <div className="flex gap-2">
                    <Chip active={temperatureUnit === 'F'} onClick={() => setTemperatureUnit('F')}>
                      °F
                    </Chip>
                    <Chip active={temperatureUnit === 'C'} onClick={() => setTemperatureUnit('C')}>
                      °C
                    </Chip>
                  </div>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed text-faint">
                This tracker is for personal record-keeping only and is not a diagnostic tool. For concerns about your baby&apos;s temperature, contact your pediatrician.
              </p>
            </>
          )}

          {logType === 'medicine' && (
            <>
              <div>
                <label htmlFor="medicineName" className={fieldLabel}>
                  Medicine Name
                </label>
                <input
                  id="medicineName"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="Tylenol"
                  className={fieldInput}
                />
              </div>
              <div>
                <label htmlFor="medicineDosage" className={fieldLabel}>
                  Dosage
                </label>
                <input
                  id="medicineDosage"
                  value={medicineDosage}
                  onChange={(e) => setMedicineDosage(e.target.value)}
                  placeholder="2.5ml"
                  className={fieldInput}
                />
              </div>
              <p className="text-[12px] leading-relaxed text-faint">
                Always verify medication dosages with your pediatrician.
              </p>
            </>
          )}

          {logType === 'mood' && (
            <div>
              <span className={fieldLabel}>Mood Level</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setMoodLevel(level as any)}
                    className={cn(
                      'h-12 w-12 rounded-full text-2xl transition-all',
                      moodLevel === level ? 'scale-110 bg-clay' : 'bg-card2 hover:bg-card-hover'
                    )}
                  >
                    {level === 1 ? '😢' : level === 2 ? '😕' : level === 3 ? '😐' : level === 4 ? '😊' : '😄'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {logType === 'weight' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="weight" className={fieldLabel}>
                  Weight
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="12.5"
                  className={fieldInput}
                />
              </div>
              <div className="w-28">
                <span className={fieldLabel}>Unit</span>
                <div className="flex gap-2">
                  <Chip active={weightUnit === 'lbs'} onClick={() => setWeightUnit('lbs')}>
                    lbs
                  </Chip>
                  <Chip active={weightUnit === 'kg'} onClick={() => setWeightUnit('kg')}>
                    kg
                  </Chip>
                </div>
              </div>
            </div>
          )}

          {logType === 'height' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="height" className={fieldLabel}>
                  Height
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="24"
                  className={fieldInput}
                />
              </div>
              <div className="w-28">
                <span className={fieldLabel}>Unit</span>
                <div className="flex gap-2">
                  <Chip active={heightUnit === 'in'} onClick={() => setHeightUnit('in')}>
                    in
                  </Chip>
                  <Chip active={heightUnit === 'cm'} onClick={() => setHeightUnit('cm')}>
                    cm
                  </Chip>
                </div>
              </div>
            </div>
          )}

          {logType === 'milestone' && (
            <div>
              <label htmlFor="milestoneName" className={fieldLabel}>
                Milestone
              </label>
              <input
                id="milestoneName"
                value={milestoneName}
                onChange={(e) => setMilestoneName(e.target.value)}
                placeholder="First smile"
                className={fieldInput}
              />
            </div>
          )}

          {logType === 'custom' && (
            <div>
              <label htmlFor="customType" className={fieldLabel}>
                Log Type
              </label>
              <input
                id="customType"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Bath time"
                className={fieldInput}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className={fieldLabel}>
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className={cn(fieldInput, 'min-h-[80px] resize-y')}
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
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
          </button>
        </div>
      </Panel>
    </div>
  )
}

export default function LogClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </div>
      }
    >
      <LogEntryContent />
    </Suspense>
  )
}
