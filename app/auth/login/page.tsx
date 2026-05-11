'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendGardenMagicLink } from '@/lib/actions/household'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Leaf, Loader2, MailCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const result = await sendGardenMagicLink(email)

      if (!result.success) {
        setError(result.error ?? 'We could not send your garden sign-in link.')
        return
      }

      setSuccess(result.message ?? 'Check your email for your garden sign-in link.')
    } catch (err) {
      console.error('Magic link request failed:', err)
      setError('Sign in did not start. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle className="text-2xl">Open the garden gate</CardTitle>
          <CardDescription>
            Enter your invited email and we&apos;ll send you a secure sign-in link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <MailCheck className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
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
                disabled={loading || Boolean(success)}
                autoComplete="email"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading || Boolean(success)}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Sending link...' : 'Send secure sign-in link'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Invited family members use the email address their invite was sent to.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
