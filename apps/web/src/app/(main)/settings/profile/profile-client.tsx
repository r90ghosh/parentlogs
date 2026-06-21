'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useUser } from '@/components/user-provider'
import { useUpdateProfile } from '@/hooks/use-profile'
import { createClient } from '@/lib/supabase/client'
import { Panel } from '@/components/digest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { ArrowLeft, Camera, Loader2, Save, Trash2, AlertTriangle, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { UserRole } from '@tdc/shared/types'

export default function ProfileClient() {
  const router = useRouter()
  const { toast } = useToast()
  const { signOut } = useAuth()
  const { user, profile } = useUser()
  const updateProfile = useUpdateProfile()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState(profile.full_name || '')
  const [role, setRole] = useState<UserRole>(profile.role)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password management state
  const hasEmailIdentity = user.identities?.some((i: { provider: string }) => i.provider === 'email') ?? false
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  usePageHeader({ title: 'Profile', subtitle: 'Name, avatar, and role' }, [])

  // Keep local state in sync with profile data
  useEffect(() => {
    setFullName(profile.full_name)
    setRole(profile.role)
  }, [profile])

  const handleSave = async () => {
    setError(null)

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: {
          full_name: fullName,
          role,
        },
      })
      toast({ title: 'Profile updated successfully' })
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    }
  }

  const handlePasswordSubmit = async () => {
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (hasEmailIdentity && newPassword === currentPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    setIsSavingPassword(true)

    try {
      // If user has email identity, verify current password first
      if (hasEmailIdentity) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: currentPassword,
        })
        if (signInError) {
          setPasswordError('Current password is incorrect')
          setIsSavingPassword(false)
          return
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setPasswordError(updateError.message)
      } else {
        setPasswordSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast({ title: hasEmailIdentity ? 'Password changed successfully' : 'Password set successfully' })
        setTimeout(() => setPasswordSuccess(false), 3000)
      }
    } catch {
      setPasswordError('Something went wrong. Please try again.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: { avatar_url: publicUrl },
      })

      toast({ title: 'Avatar updated successfully' })
    } catch (err) {
      setError('Failed to upload avatar')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      // Call delete account API
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      toast({ title: 'Account deleted' })
      await signOut()
      router.push('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete account'
      setError(message)
      toast({ title: 'Could not delete account', description: message, variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
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

      {/* Profile Photo */}
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Profile Photo</div>
      <Panel className="p-[18px]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="grid h-24 w-24 flex-none place-items-center overflow-hidden rounded-full bg-clay-soft text-2xl font-extrabold text-clay-ink">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name || ''} className="h-full w-full object-cover" />
              ) : (
                profile.full_name?.charAt(0).toUpperCase() || 'U'
              )}
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-clay transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="text-[13px] text-mute">
            <p>Click to upload a new avatar</p>
            <p>Recommended: Square image</p>
            <p>Max size: 5MB</p>
          </div>
        </div>
      </Panel>

      {/* Profile Details */}
      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Profile Details</div>
      <Panel className="space-y-4 p-[18px]">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-bold text-ink2">Email</label>
          <input
            id="email"
            value={profile.email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-line bg-card2 px-3.5 py-2.5 text-[15px] text-mute outline-none"
          />
          <p className="text-[12px] text-faint">Email cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-[13px] font-bold text-ink2">Full Name</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="text-[13px] font-bold text-ink2">Role</label>
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="rounded-xl border-line bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mom">Mom</SelectItem>
              <SelectItem value="dad">Dad</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[12px] text-faint">
            This helps personalize task assignments and content
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
        >
          {updateProfile.isPending ? (
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
      </Panel>

      {/* Password */}
      <div className="mb-3 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
        <KeyRound className="h-3.5 w-3.5 text-clay-ink" />
        {hasEmailIdentity ? 'Change Password' : 'Set a Password'}
      </div>
      <Panel className="p-[18px]">
        <p className="mb-4 text-[13px] text-mute">
          {hasEmailIdentity
            ? 'Update your account password'
            : 'Set a password so you can also sign in with email'}
        </p>
        <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit() }} className="space-y-4">
          {passwordError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13.5px] text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{passwordError}</span>
            </div>
          )}
          {passwordSuccess && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[--sage]/30 bg-[--sage]/10 px-4 py-3 text-[13.5px] text-[--sage]">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{hasEmailIdentity ? 'Password changed successfully!' : 'Password set successfully!'}</span>
            </div>
          )}

          {hasEmailIdentity && (
            <div className="space-y-1.5">
              <label htmlFor="currentPassword" className="text-[13px] font-bold text-ink2">Current Password</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 pr-10 text-[15px] text-ink outline-none focus:border-clay"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mute transition-colors hover:text-ink"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-[13px] font-bold text-ink2">New Password</label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 pr-10 text-[15px] text-ink outline-none focus:border-clay"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mute transition-colors hover:text-ink"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[12px] text-faint">Minimum 8 characters</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[13px] font-bold text-ink2">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingPassword || !newPassword || !confirmPassword || (hasEmailIdentity && !currentPassword)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSavingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {hasEmailIdentity ? 'Changing...' : 'Setting...'}
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                {hasEmailIdentity ? 'Change Password' : 'Set Password'}
              </>
            )}
          </button>
        </form>
      </Panel>

      {/* Danger Zone */}
      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-danger">Danger Zone</div>
      <Panel className="p-[18px]">
        <p className="mb-4 text-[13px] text-mute">
          Irreversible actions that affect your account
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  <p>This action cannot be undone. This will permanently delete your account
                  and remove all your data including:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Your profile and settings</li>
                    <li>All task history and progress</li>
                    <li>Baby tracker logs</li>
                    <li>Budget items and checklists</li>
                  </ul>
                  <p className="mt-2 font-medium text-danger">
                    If you&apos;re the only member, your family will also be deleted.
                  </p>
                  <p className="mt-2 font-medium text-[--gold]">
                    If you have an active subscription, it will be automatically canceled.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-danger text-white hover:opacity-90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, delete my account'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Panel>
    </div>
  )
}
