import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { UserProvider } from '@/components/user-provider'

export default async function UpgradeLayout({ children }: { children: ReactNode }) {
  const { user, profile, family, activeBaby } = await getServerAuth()

  if (!user || !profile) {
    redirect('/login?redirect=/upgrade')
  }

  return (
    <UserProvider user={user} profile={profile} family={family} activeBaby={activeBaby}>
      {children}
    </UserProvider>
  )
}
