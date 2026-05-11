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

export function GardenLog() {
  const [entries, setEntries] = useState<LogEntry[]>(defaultEntries)
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [newType, setNewType] = useState<LogEntry['type']>('general')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const [hasPestAlert, setHasPestAlert] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gardenLog')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch {
        setEntries(defaultEntries)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gardenLog', JSON.stringify(entries))
  }, [entries])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotos(prev => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const addEntry = () => {
    if (!newNote.trim()) return

    const entry: LogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      note: newNote.trim(),
      photos: newPhotos,
      type: newType,
      pestAlert: hasPestAlert
    }

    setEntries([entry, ...entries])
    setNewNote('')
    setNewPhotos([])
    setNewType('general')
    setHasPestAlert(false)
    setIsAddingEntry(false)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const pestAlertCount = entries.filter(e => e.pestAlert).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookHeart className="h-5 w-5 text-primary" />
            Garden Log & Health
          </span>
          <div className="flex items-center gap-2">
            {pestAlertCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Bug className="h-3 w-3" />
                {pestAlertCount} Alert{pestAlertCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Log Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Entry type selector */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Entry Type</label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(entryTypeConfig) as LogEntry['type'][]).map((type) => {
                        const config = entryTypeConfig[type]
                        const Icon = config.icon
                        return (
                          <Button
                            key={type}
                            variant={newType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewType(type)}
                            className="capitalize"
                          >
                            <Icon className={cn("h-4 w-4 mr-1", newType !== type && config.color)} />
                            {type}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea
                      placeholder="What's happening in your garden today?"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Photos</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      {newPhotos.map((photo, i) => (
                        <div key={i} className="relative">
                          <img
                            src={photo}
                            alt={`Upload ${i + 1}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setNewPhotos(newPhotos.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="h-20 w-20"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Pest Alert */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pestAlert"
                      checked={hasPestAlert}
                      onChange={(e) => setHasPestAlert(e.target.checked)}
                      className="rounded border-input"
                    />
                    <label htmlFor="pestAlert" className="text-sm flex items-center gap-1">
                      <Bug className="h-4 w-4 text-red-500" />
                      Mark as Pest/Disease Alert
                    </label>
                  </div>

                  <Button onClick={addEntry} className="w-full">
                    Save Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {entries.map((entry) => {
                const config = entryTypeConfig[entry.type]
                const Icon = config.icon
                
                return (
                  <div key={entry.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-2 top-4 h-5 w-5 rounded-full flex items-center justify-center",
                      config.bg
                    )}>
                      <Icon className={cn("h-3 w-3", config.color)} />
                    </div>

                    <div className={cn(
                      "p-4 rounded-lg border",
                      entry.pestAlert ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20" : "bg-card"
                    )}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.date)}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {entry.type}
                          </Badge>
                          {entry.pestAlert && (
                            <Badge variant="destructive" className="text-xs flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Alert
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm">{entry.note}</p>

                      {entry.photos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {entry.photos.map((photo, i) => (
                            <Dialog key={i}>
                              <DialogTrigger asChild>
                                <img
                                  src={photo}
                                  alt={`Log photo ${i + 1}`}
                                  className="h-24 w-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                />
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                                <img
                                  src={photo}
                                  alt={`Log photo ${i + 1}`}
                                  className="w-full h-auto"
                                />
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <BookHeart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No log entries yet</p>
              <p className="text-sm text-muted-foreground/80">Start tracking your garden&apos;s progress</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
