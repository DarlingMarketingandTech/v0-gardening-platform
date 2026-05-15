import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/actions/household'
import { resolvePostLoginPath } from '@/lib/access/private-beta'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PendingApprovalActions } from './pending-approval-actions'

export default async function PendingApprovalPage() {
  if (!hasPublicSupabaseEnv()) {
    redirect('/auth/login?error=configuration')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { household_id: householdId, role } = await getUserHousehold()
  if (householdId) {
    redirect(resolvePostLoginPath(role, true))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle className="text-2xl">Almost there</CardTitle>
          <CardDescription>
            Your account is ready. Ask the garden admin to approve access, or send a request if this deployment allows
            it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            When you are added to the household, sign in again and you will land in{' '}
            <span className="font-medium text-foreground">My Garden</span>.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <PendingApprovalActions />
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/signout">Sign out</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
