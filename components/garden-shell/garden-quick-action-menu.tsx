'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function GardenQuickActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-lg"
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 h-12 w-12 rounded-full shadow-lg md:bottom-6"
          aria-label="Quick actions"
        >
          <Plus className="h-5 w-5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Log a note</DropdownMenuItem>
        <DropdownMenuItem disabled>Check a plant</DropdownMenuItem>
        <DropdownMenuItem disabled>Add to plan</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
