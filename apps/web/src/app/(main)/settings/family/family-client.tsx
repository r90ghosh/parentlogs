'use client'

import { useState } from 'react'
import { useFamily, useFamilyMembers, useUpdateFamily } from '@/hooks/use-family'
import { useBabies } from '@/hooks/use-babies'
import { familyService } from '@/lib/services'
import { useUser } from '@/components/user-provider'
import { trackActivity } from '@/lib/track-activity'
import { AddBabyDialog } from '@/components/settings/add-baby-dialog'
import { isPregnancyStage } from '@tdc/shared/utils'
import type { Baby as BabyType } from '@tdc/shared/types'
import { Panel, Badge } from '@/components/digest'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft,
  Baby,
  Calendar,
  Copy,
  Loader2,
  RefreshCw,
  Save,
  UserMinus,
  Users,
  Check,
  AlertTriangle,
  Crown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'

export default function FamilyClient() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { profile } = useUser()
  const { data: family, isLoading: familyLoading } = useFamily()
  const { data: members, isLoading: membersLoading } = useFamilyMembers()
  const updateFamily = useUpdateFamily()
  const { data: babies } = useBabies()

  const [babyName, setBabyName] = useState(family?.baby_name || '')
  const [dueDate, setDueDate] = useState(family?.due_date || '')
  const [birthDate, setBirthDate] = useState(family?.birth_date || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  usePageHeader({ title: 'Family', subtitle: 'Due date, baby name, partner' }, [])

  const isLoading = familyLoading || membersLoading
  const isOwner = family && members?.some(m => m.id === profile?.id && m.is_owner)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      await updateFamily.mutateAsync({
        baby_name: babyName || undefined,
        due_date: dueDate || undefined,
        birth_date: birthDate || undefined,
        stage: birthDate ? 'post-birth' : 'pregnancy',
      })

      toast({ title: 'Family settings updated' })
    } catch (err) {
      setError('Failed to update family settings')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyInviteCode = async () => {
    if (!family?.invite_code) return

    try {
      await navigator.clipboard.writeText(family.invite_code)
      setCopied(true)
      trackActivity(profile.id, 'partner_invited')
      toast({ title: 'Invite code copied!' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  const handleRegenerateCode = async () => {
    setIsRegenerating(true)
    setError(null)

    try {
      const newCode = await familyService.regenerateInviteCode()
      if (newCode) {
        queryClient.invalidateQueries({ queryKey: ['family'] })
        toast({ title: 'Invite code regenerated' })
      } else {
        throw new Error('Failed to regenerate code')
      }
    } catch (err) {
      setError('Failed to regenerate invite code')
      console.error(err)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleLeaveFamily = async () => {
    setIsLeaving(true)
    setError(null)

    try {
      const { error: leaveError } = await familyService.leaveFamily()
      if (leaveError) throw leaveError

      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
      toast({ title: 'You have left the family' })
      router.push('/onboarding')
    } catch (err) {
      setError('Failed to leave family')
      console.error(err)
    } finally {
      setIsLeaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-5 w-20 animate-pulse rounded bg-card2" />
        <div className="mt-6 h-48 w-full animate-pulse rounded-[18px] bg-card2" />
        <div className="mt-6 h-48 w-full animate-pulse rounded-[18px] bg-card2" />
      </div>
    )
  }

  if (!family) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
          <ArrowLeft className="h-4 w-4" /> Settings
        </Link>

        <Panel className="p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-faint" />
          <p className="mb-4 text-[15px] text-mute">You&apos;re not part of a family yet</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          >
            Set Up Family
          </Link>
        </Panel>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Settings
      </Link>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13.5px] text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Family Members */}
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        <Users className="h-3.5 w-3.5" />
        Family Members
      </div>
      <Panel className="p-[18px]">
        <p className="mb-4 text-[13px] text-mute">
          {members?.length === 1
            ? 'You are the only member'
            : `${members?.length} members in your family`}
        </p>
        <div className="space-y-3">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-xl bg-card2 p-3">
              <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full bg-clay-soft text-sm font-extrabold text-clay-ink">
                {member.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.avatar_url} alt={member.full_name} className="h-full w-full object-cover" />
                ) : (
                  member.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-semibold text-ink">{member.full_name}</p>
                  {member.is_owner && (
                    <Badge tone="gold">
                      <Crown className="mr-1 h-3 w-3" />
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="text-[13px] capitalize text-mute">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Partner */}
        <div className="mt-4 space-y-3 border-t border-line2 pt-4">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
            Invite Partner
          </div>

          {/* Invite code display */}
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl border border-line bg-card2 px-4 py-3 text-center">
              <span className="font-mono text-lg font-semibold tracking-[0.2em] text-clay-ink">
                {family.invite_code}
              </span>
            </div>
            <button
              onClick={handleCopyInviteCode}
              className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl border border-line bg-card text-ink2 hover:bg-card-hover"
            >
              {copied ? <Check className="h-4 w-4 text-[--sage]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Share invite link */}
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-clay-ink hover:bg-card-hover"
            onClick={async () => {
              if (!family?.invite_code) return
              try {
                const inviteLink = `${window.location.origin}/signup?invite=${family.invite_code}`
                await navigator.clipboard.writeText(inviteLink)
                toast({ title: 'Invite link copied!', description: 'Share this link with your partner to join your family.' })
              } catch {
                toast({ title: 'Failed to copy link', variant: 'destructive' })
              }
            }}
          >
            <Copy className="h-4 w-4" />
            Copy Invite Link
          </button>

          {/* Regenerate */}
          {isOwner && (
            <button
              onClick={handleRegenerateCode}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 text-[13px] font-bold text-mute hover:text-ink disabled:opacity-50"
            >
              {isRegenerating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Regenerate Code
            </button>
          )}

          <p className="text-[12px] text-faint">
            Your partner can use this code or link to join your family after signing up.
          </p>
        </div>
      </Panel>

      {/* Baby Details */}
      <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        <Baby className="h-3.5 w-3.5" />
        {babies && babies.length > 1 ? 'Babies' : 'Baby Details'}
      </div>
      <Panel className="space-y-4 p-[18px]">
        {babies?.map((baby: BabyType, index: number) => (
          <div key={baby.id} className="space-y-3 rounded-xl bg-card2 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-ink">
                {baby.baby_name || `Baby ${index + 1}`}
              </p>
              <Badge tone="clay">
                {isPregnancyStage(baby.stage)
                  ? `Week ${baby.current_week}`
                  : baby.current_week <= 12
                    ? `Week ${baby.current_week}`
                    : `${Math.floor(baby.current_week / 4)} months`
                }
              </Badge>
            </div>
            <p className="text-[13px] capitalize text-mute">
              {isPregnancyStage(baby.stage) ? 'Expecting' : 'Post-Birth'}
              {baby.due_date && isPregnancyStage(baby.stage) && ` · Due ${format(new Date(baby.due_date), 'MMM d, yyyy')}`}
              {baby.birth_date && ` · Born ${format(new Date(baby.birth_date), 'MMM d, yyyy')}`}
            </p>
          </div>
        ))}

        {/* Legacy single-baby edit form (only if no babies loaded yet or fallback) */}
        {(!babies || babies.length === 0) && (
          <>
            <div className="space-y-1.5">
              <label htmlFor="babyName" className="text-[13px] font-bold text-ink2">Baby&apos;s Name (optional)</label>
              <input
                id="babyName"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="Enter baby's name"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="dueDate" className="flex items-center gap-2 text-[13px] font-bold text-ink2">
                <Calendar className="h-4 w-4" />
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="birthDate" className="flex items-center gap-2 text-[13px] font-bold text-ink2">
                <Calendar className="h-4 w-4" />
                Birth Date (if born)
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
              />
              <p className="text-[12px] text-faint">
                Setting a birth date will switch your family to post-birth mode
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </>
        )}

        <AddBabyDialog />
      </Panel>

      {/* Leave Family */}
      {!isOwner && (
        <>
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-[--gold]">Leave Family</div>
          <Panel className="p-[18px]">
            <p className="mb-4 text-[13px] text-mute">
              Remove yourself from this family
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[--gold]/40 bg-card px-4 py-2.5 text-[14px] font-bold text-[--gold] hover:bg-card-hover">
                  <UserMinus className="h-4 w-4" />
                  Leave Family
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Family?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be removed from this family. Your personal data will be preserved,
                    but you&apos;ll lose access to shared family data like tasks and tracker logs.
                    You can join another family or create a new one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveFamily}
                    disabled={isLeaving}
                    className="bg-[--gold] text-[--bg] hover:opacity-90"
                  >
                    {isLeaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Leaving...
                      </>
                    ) : (
                      'Yes, leave family'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Panel>
        </>
      )}

      {isOwner && members && members.length > 1 && (
        <div className="mt-7 flex items-start gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-[13.5px] text-ink2">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-mute" />
          <span>
            As the family owner, you cannot leave while other members are present.
            Transfer ownership or have all members leave first.
          </span>
        </div>
      )}
    </div>
  )
}
