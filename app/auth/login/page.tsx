'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Leaf, Loader2 } from 'lucide-react'
import { resolvePostLoginPath } from '@/lib/access/private-beta'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [configFromRedirect, setConfigFromRedirect] = useState(false)
  const router = useRouter()

  const supabaseConfigured = hasPublicSupabaseEnv()
  const supabase = useMemo(() => (supabaseConfigured ? createClient() : null), [supabaseConfigured])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setConfigFromRedirect(params.get('error') === 'configuration')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!supabase) {
      setError('Sign-in is not available because this environment is not configured yet.')
      return
    }
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError(userError?.message ?? 'Could not load your account. Please try again.')
        return
      }

      const { data: membership, error: membershipError } = await supabase
        .from('household_members')
        .select('household_id, role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (membershipError) {
        setError('You signed in, but we could not check your garden access. Please try again.')
        return
      }

      const hasHousehold = Boolean(membership?.household_id)
      const path = resolvePostLoginPath(membership?.role, hasHousehold)
      router.replace(path)
      router.refresh()
    } catch (err) {
      console.error('Login failed:', err)
      setError('Sign in did not finish. Please try again.')
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your garden
          </CardDescription>
        </CardHeader>

        {!supabaseConfigured ? (
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Sign-in is not configured on this deployment yet (missing public Supabase settings). You can still
                explore the calm demo in{' '}
                <Link href="/my-garden" className="font-medium text-primary underline underline-offset-2">
                  My Garden
                </Link>
                .
              </AlertDescription>
            </Alert>
            {configFromRedirect ? (
              <p className="text-sm text-muted-foreground text-center">
                The page you tried to open needs sign-in, but the preview environment does not have database sign-in
                enabled.
              </p>
            ) : null}
            <Button asChild className="w-full">
              <Link href="/my-garden">Open demo garden</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
