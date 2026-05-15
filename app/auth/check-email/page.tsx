import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  searchParams?: Promise<{ email?: string }>
}

export default async function CheckEmailPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {}
  const email = sp.email?.trim()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Momma D&apos;s Garden</span>
          </Link>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a confirmation link{email ? ` to ${email}` : ''}. Tap the link in that email to finish setting up
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground text-center">
          <p>Did not get it? Check spam, then wait a minute and try signing in again.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="default">
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
