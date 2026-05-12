'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Plant } from '@/lib/types'

interface AddPlantDialogProps {
  gardenId: string
  plants: Plant[]
}

export function AddPlantDialog({ gardenId, plants }: AddPlantDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedPlantId, setSelectedPlantId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [plantedDate, setPlantedDate] = useState('')
  const [status, setStatus] = useState('planned')
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlantId) {
      toast.error('Please select a plant')
      return
    }

    startTransition(async () => {
      const selectedPlant = plants.find(p => p.id === selectedPlantId)
      const daysToHarvest = selectedPlant?.days_to_harvest

      let expectedHarvestDate: string | null = null
      if (plantedDate && daysToHarvest) {
        const planted = new Date(plantedDate)
        planted.setDate(planted.getDate() + daysToHarvest)
        expectedHarvestDate = planted.toISOString().split('T')[0]
      }

      // Legacy write path: old `garden_plants` inserts should eventually move
      // to household-scoped `plantings` linked to `plant_library`.
      const { error } = await supabase
        .from('garden_plants')
        .insert({
          garden_id: gardenId,
          plant_id: selectedPlantId,
          quantity: parseInt(quantity) || 1,
          planted_date: plantedDate || null,
          expected_harvest_date: expectedHarvestDate,
          status,
          notes: notes || null,
        })

      if (error) {
        toast.error('Failed to add plant: ' + error.message)
        return
      }

      toast.success('Plant added to garden!')
      setOpen(false)
      resetForm()
      router.refresh()
    })
  }

  const resetForm = () => {
    setSelectedPlantId('')
    setQuantity('1')
    setPlantedDate('')
    setStatus('planned')
    setNotes('')
    setSearchTerm('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Plant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Plant to Garden</DialogTitle>
          <DialogDescription>
            Select a plant from the database and add it to your garden.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Plants</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plant">Select Plant *</Label>
            <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredPlants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name} {plant.scientific_name && `(${plant.scientific_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="planted">Planted</SelectItem>
                  <SelectItem value="growing">Growing</SelectItem>
                  <SelectItem value="harvesting">Harvesting</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantedDate">Planted Date</Label>
            <Input
              id="plantedDate"
              type="date"
              value={plantedDate}
              onChange={(e) => setPlantedDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this plant..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !selectedPlantId}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Plant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
