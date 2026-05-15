'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { claimPrivateBetaHousehold, resolvePrivateBetaDestination } from '@/lib/access/private-beta'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
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
  const router = useRouter()

  const supabaseConfigured = hasPublicSupabaseEnv()
  const supabase = useMemo(() => (supabaseConfigured ? createClient() : null), [supabaseConfigured])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!supabase) {
      setError('Sign-up is not available because this environment is not configured yet.')
      return
    }
    setLoading(true)

    const normalizedEmail = email.trim().toLowerCase()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent('/my-garden')}`

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (!data.session) {
        router.replace(`/auth/check-email?email=${encodeURIComponent(normalizedEmail)}`)
        router.refresh()
        return
      }

      const claim = await claimPrivateBetaHousehold(supabase)
      if (!claim.success && !claim.notAllowlisted && claim.errorMessage) {
        setError(claim.errorMessage)
        return
      }

      router.replace(resolvePrivateBetaDestination(claim))
      router.refresh()
    } catch (err) {
      console.error('Sign up failed:', err)
      setError('Sign up did not finish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle className="text-2xl">Join Momma D&apos;s Garden</CardTitle>
          <CardDescription>
            Create an account with the email Jacob added to the private beta list.
          </CardDescription>
        </CardHeader>

        {!supabaseConfigured ? (
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Sign-up is not configured on this deployment yet (missing public Supabase settings). You can still
                explore the calm demo in{' '}
                <Link href="/my-garden" className="font-medium text-primary underline underline-offset-2">
                  My Garden
                </Link>
                .
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/my-garden">Open demo garden</Link>
            </Button>
          </CardContent>
        ) : (
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
                  required
                  disabled={loading}
                />
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
        )}
      </Card>
    </div>
  )
}
