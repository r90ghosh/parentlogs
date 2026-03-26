'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useUser } from '@/components/user-provider'
import { useUpdateProfile } from '@/hooks/use-profile'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { ArrowLeft, Camera, Loader2, Save, Trash2, AlertTriangle, KeyRound, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
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
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
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
        <h1 className="font-display text-xl font-bold text-[--white]">Profile</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Avatar Section */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Profile Photo</CardTitle>
          <CardDescription className="font-body">Click to upload a new avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                <AvatarFallback className="font-display text-2xl">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-copper flex items-center justify-center hover:bg-copper/80 transition-colors disabled:opacity-50"
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
            <div className="font-body text-sm text-[--muted]">
              <p>Recommended: Square image</p>
              <p>Max size: 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-ui font-medium">Email</Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="bg-[--card] border-[--border] text-[--muted]"
            />
            <p className="font-body text-xs text-[--dim]">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-ui font-medium">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="bg-[--card] border-[--border]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="font-ui font-medium">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="bg-[--card] border-[--border]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mom">Mom</SelectItem>
                <SelectItem value="dad">Dad</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="font-body text-xs text-[--dim]">
              This helps personalize task assignments and content
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="w-full bg-copper hover:bg-copper/80 font-ui font-semibold"
          >
            {updateProfile.isPending ? (
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

      {/* Password */}
      <Card className="bg-[--surface] border-[--border]">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-copper" />
            {hasEmailIdentity ? 'Change Password' : 'Set a Password'}
          </CardTitle>
          <CardDescription className="font-body">
            {hasEmailIdentity
              ? 'Update your account password'
              : 'Set a password so you can also sign in with email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit() }} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {passwordSuccess && (
              <Alert className="bg-sage/10 border-sage/30">
                <AlertDescription className="text-sage font-body">
                  {hasEmailIdentity ? 'Password changed successfully!' : 'Password set successfully!'}
                </AlertDescription>
              </Alert>
            )}

            {hasEmailIdentity && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="font-ui font-medium">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="bg-[--card] border-[--border] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[--muted] hover:text-[--cream] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-ui font-medium">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="bg-[--card] border-[--border] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--muted] hover:text-[--cream] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="font-body text-xs text-[--dim]">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-ui font-medium">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="bg-[--card] border-[--border]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSavingPassword || !newPassword || !confirmPassword || (hasEmailIdentity && !currentPassword)}
              className="w-full bg-copper hover:bg-copper/80 font-ui font-semibold"
            >
              {isSavingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {hasEmailIdentity ? 'Changing...' : 'Setting...'}
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  {hasEmailIdentity ? 'Change Password' : 'Set Password'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[--surface] border-coral/30">
        <CardHeader>
          <CardTitle className="font-display text-lg text-coral">Danger Zone</CardTitle>
          <CardDescription className="font-body">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full font-ui font-semibold">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[--surface] border-[--border]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-[--white]">Delete Account?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="font-body text-[--muted]">
                    <p>This action cannot be undone. This will permanently delete your account
                    and remove all your data including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile and settings</li>
                      <li>All task history and progress</li>
                      <li>Baby tracker logs</li>
                      <li>Budget items and checklists</li>
                    </ul>
                    <p className="mt-2 font-medium text-coral">
                      If you&apos;re the only member, your family will also be deleted.
                    </p>
                    <p className="mt-2 font-medium text-gold">
                      If you have an active subscription, it will be automatically canceled.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[--card] border-[--border] font-ui">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-coral hover:bg-coral/80 font-ui font-semibold"
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
        </CardContent>
      </Card>
    </div>
  )
}
