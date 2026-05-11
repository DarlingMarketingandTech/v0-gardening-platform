'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface NewGardenAreaFormProps {
  householdId: string
}

export function NewGardenAreaForm({ householdId }: NewGardenAreaFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!name.trim()) {
        setError('Area name is required')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase
        .from('garden_areas')
        .insert({
          household_id: householdId,
          name: name.trim(),
          description: description.trim() || null,
          sort_order: 0,
        })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      toast.success('Garden area created!')
      router.push('/gardens')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create garden area')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Area Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Raised Bed, Ground, Pots"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe this garden area..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Area
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()} 
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
