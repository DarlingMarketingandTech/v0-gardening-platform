'use client'

import { useMemo, useState } from 'react'
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

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabaseConfigured = hasPublicSupabaseEnv()
  const supabase = useMemo(() => (supabaseConfigured ? createClient() : null), [supabaseConfigured])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!supabase) {
      setError('This environment is not configured for password updates yet.')
      return
    }
    if (password.length < 6) {
      setError('Use at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
        return
      }
      router.replace('/auth/login')
      router.refresh()
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
          <CardTitle className="text-2xl">Set a new password</CardTitle>
          <CardDescription>Use the link from your recovery email, then choose a new password here.</CardDescription>
        </CardHeader>

        {!supabaseConfigured ? (
          <CardContent>
            <Alert>
              <AlertDescription>Supabase is not configured on this deployment.</AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving…' : 'Update password'}
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/auth/login">Cancel</Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
