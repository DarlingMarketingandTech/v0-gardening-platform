import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NotAllowedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle>Private beta</CardTitle>
          <CardDescription>
            This garden app is invite-only right now. Your email is not on the access list yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ask Jacob to add your email to the allowlist. Once it is added, sign in again and your own garden will be
            ready for you.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
