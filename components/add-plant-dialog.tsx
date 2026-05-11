'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AddPlantDialogProps {
  gardenAreaId: string
  variant?: 'default' | 'outline'
}

export function AddPlantDialog({ gardenAreaId, variant = 'default' }: AddPlantDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [customName, setCustomName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customName.trim()) {
      toast.error('Please enter a plant name')
      return
    }

    if (!plantedDate) {
      toast.error('Please enter a planted date')
      return
    }

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Not authenticated')
        return
      }

      const { error } = await supabase
        .from('plantings')
        .insert({
          garden_area_id: gardenAreaId,
          custom_name: customName.trim(),
          quantity: parseInt(quantity) || 1,
          planted_date: plantedDate,
          status: 'planted',
          notes: notes.trim() || null,
          planted_by_user_id: user.id,
        })

      if (error) {
        toast.error('Failed to add plant: ' + error.message)
        return
      }

      toast.success('Plant added!')
      setOpen(false)
      resetForm()
      router.refresh()
    })
  }

  const resetForm = () => {
    setStep(1)
    setCustomName('')
    setQuantity('1')
    setPlantedDate(new Date().toISOString().split('T')[0])
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Plant to Area</DialogTitle>
          <DialogDescription>
            {step === 1 && 'What did you plant?'}
            {step === 2 && 'When did you plant it?'}
            {step === 3 && 'Add any notes (optional)'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="customName">Plant Name or Type *</Label>
              <Input
                id="customName"
                placeholder="e.g., Cherry Tomatoes, Basil, Zucchini"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                autoFocus
              />
              <div className="space-y-2 pt-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="plantedDate">Planted Date *</Label>
              <Input
                id="plantedDate"
                type="date"
                value={plantedDate}
                onChange={(e) => setPlantedDate(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any notes about this plant..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-between gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                if (step > 1) setStep(step - 1)
                else setOpen(false)
              }}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            {step < 3 ? (
              <Button 
                type="button" 
                onClick={() => {
                  if (step === 1 && !customName.trim()) {
                    toast.error('Please enter a plant name')
                    return
                  }
                  setStep(step + 1)
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Plant
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
