'use client'

import { useState } from 'react'
import { useFamily, useFamilyMembers, useUpdateFamily } from '@/hooks/use-family'
import { familyService } from '@/services/family-service'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'

export default function FamilySettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const { data: family, isLoading: familyLoading } = useFamily()
  const { data: members, isLoading: membersLoading } = useFamilyMembers()
  const updateFamily = useUpdateFamily()

  const [babyName, setBabyName] = useState(family?.baby_name || '')
  const [dueDate, setDueDate] = useState(family?.due_date || '')
  const [birthDate, setBirthDate] = useState(family?.birth_date || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!family) {
    return (
      <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-white">Family</h1>
        </div>

        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-surface-600 mx-auto mb-4" />
            <p className="text-surface-400 mb-4">You&apos;re not part of a family yet</p>
            <Button asChild>
              <Link href="/onboarding">Set Up Family</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:ml-64 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Family</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Family Members */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Members
          </CardTitle>
          <CardDescription>
            {members?.length === 1
              ? 'Invite your partner to join'
              : `${members?.length} members in your family`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar_url} alt={member.full_name} />
                <AvatarFallback>
                  {member.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{member.full_name}</p>
                  {member.is_owner && (
                    <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                      <Crown className="h-3 w-3 mr-1" />
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-surface-400 capitalize">{member.role}</p>
              </div>
            </div>
          ))}

          {/* Invite Code */}
          <div className="pt-4 border-t border-surface-800">
            <Label className="text-sm text-surface-400">Invite Code</Label>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-surface-800 rounded-lg px-4 py-3 font-mono text-lg tracking-wider text-white">
                {family.invite_code}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyInviteCode}
                className="h-12 w-12"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-surface-500 mt-2">
              Share this code with your partner to join your family
            </p>

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateCode}
                disabled={isRegenerating}
                className="mt-2"
              >
                {isRegenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Regenerate Code
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Baby Details */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Baby Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="babyName">Baby&apos;s Name (optional)</Label>
            <Input
              id="babyName"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Enter baby's name"
              className="bg-surface-800 border-surface-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-surface-800 border-surface-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Birth Date (if born)
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-surface-800 border-surface-700"
            />
            <p className="text-xs text-surface-500">
              Setting a birth date will switch your family to post-birth mode
            </p>
          </div>

          {/* Current Stage Display */}
          <div className="p-3 bg-surface-800/50 rounded-lg">
            <p className="text-sm text-surface-400">Current Stage</p>
            <p className="text-white font-medium capitalize">
              {family.stage === 'pregnancy' ? 'Pregnancy' : 'Post-Birth'}
              {' · '}
              Week {family.current_week}
            </p>
            {family.due_date && family.stage === 'pregnancy' && (
              <p className="text-xs text-surface-500 mt-1">
                Due: {format(new Date(family.due_date), 'MMMM d, yyyy')}
              </p>
            )}
            {family.birth_date && (
              <p className="text-xs text-surface-500 mt-1">
                Born: {format(new Date(family.birth_date), 'MMMM d, yyyy')}
              </p>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-accent-500 hover:bg-accent-600"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Leave Family */}
      {!isOwner && (
        <Card className="bg-surface-900 border-amber-900/50">
          <CardHeader>
            <CardTitle className="text-lg text-amber-500">Leave Family</CardTitle>
            <CardDescription>
              Remove yourself from this family
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-amber-600 text-amber-500 hover:bg-amber-500/10">
                  <UserMinus className="mr-2 h-4 w-4" />
                  Leave Family
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-surface-900 border-surface-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Leave Family?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be removed from this family. Your personal data will be preserved,
                    but you&apos;ll lose access to shared family data like tasks and tracker logs.
                    You can join another family or create a new one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-surface-800 border-surface-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveFamily}
                    disabled={isLeaving}
                    className="bg-amber-600 hover:bg-amber-700"
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
          </CardContent>
        </Card>
      )}

      {isOwner && members && members.length > 1 && (
        <Alert className="bg-surface-800 border-surface-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-surface-300">
            As the family owner, you cannot leave while other members are present.
            Transfer ownership or have all members leave first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
