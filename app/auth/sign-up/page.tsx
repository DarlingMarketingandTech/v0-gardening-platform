'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { checkFamilyInvite, acceptFamilyInvite } from '@/lib/actions/household'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Leaf, Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<{ invited: boolean; household_name?: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailBlur = async () => {
    if (email) {
      const invite = await checkFamilyInvite(email)
      setInviteInfo(invite)
      if (!invite.invited) {
        setError(`${email} is not invited to Momma D's Garden. Please contact the garden admin.`)
      } else {
        setError(null)
      }
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Verify invite one more time before signup
    const invite = await checkFamilyInvite(email)
    if (!invite.invited) {
      setError(`${email} is not invited to Momma D's Garden.`)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Get the session
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('Failed to create account')
      setLoading(false)
      return
    }

    // Accept the invite and link to household
    const { success: acceptSuccess, error: acceptError } = await acceptFamilyInvite(email, user.id, fullName)
    if (!acceptSuccess) {
      setError(acceptError || 'Failed to join household')
      setLoading(false)
      return
    }

    // Sign in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/my-garden')
    router.refresh()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle className="text-2xl">Join Momma D&apos;s Garden</CardTitle>
          <CardDescription>
            Sign up to access the family garden notebook
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
                disabled={loading}
              />
              {inviteInfo && inviteInfo.invited && (
                <p className="text-sm text-green-600">
                  ✓ You&apos;re invited to {inviteInfo.household_name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
