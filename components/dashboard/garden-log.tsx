'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Leaf, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Observation } from '@/lib/types'

interface GardenLogProps {
  householdId: string
}

export function GardenLog({ householdId }: GardenLogProps) {
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchObservations()
  }, [householdId])

  const fetchObservations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .eq('household_id', householdId)
      .order('observed_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching observations:', error)
      setObservations([])
    } else {
      setObservations((data || []) as Observation[])
    }
    setLoading(false)
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setSubmitting(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Not authenticated')
      setSubmitting(false)
      return
    }

    const { error } = await supabase
      .from('observations')
      .insert({
        household_id: householdId,
        created_by_user_id: user.id,
        note: newNote.trim(),
        observed_at: new Date().toISOString().split('T')[0],
      })

    if (error) {
      toast.error('Failed to save note')
    } else {
      toast.success('Note saved!')
      setNewNote('')
      await fetchObservations()
    }
    setSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Garden Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddNote} className="space-y-2">
          <Textarea
            placeholder="What did you notice in the garden today?"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
          />
          <Button type="submit" disabled={submitting || !newNote.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </form>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading notes...</p>
          ) : observations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No garden notes yet.</p>
          ) : (
            observations.map((obs) => (
              <div
                key={obs.id}
                className="p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{obs.note}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(obs.observed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
