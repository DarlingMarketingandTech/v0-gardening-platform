'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import type { LucideIcon } from 'lucide-react'
import type { CareToolDescriptor, CareToolId } from '@/lib/garden-os/types'
import { BookOpen, Bug, ScanLine, Sprout } from 'lucide-react'

const toolIcons: Record<CareToolId, LucideIcon> = {
  'plant-check': Sprout,
  'symptom-check': BookOpen,
  'pest-lookup': Bug,
  'plant-identify': ScanLine,
}

export interface CareToolGridProps {
  tools: CareToolDescriptor[]
  onOpenTool: (toolId: CareToolId) => void
}

export function CareToolGrid({ tools, onOpenTool }: CareToolGridProps) {
  return (
    <section aria-label="Care tools" className="space-y-3">
      <div className="space-y-1 px-0.5">
        <h3 className="text-base font-semibold text-(--garden-text)">Tools</h3>
        <p className="text-sm text-(--garden-text-muted)">
          Plant check, symptoms, pests, and identify — pick what you need today.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = toolIcons[tool.id]
          return (
            <AppSurface
              key={tool.id}
              variant="elevated"
              padding="md"
              radius="xl"
              interactive
              role="button"
              tabIndex={0}
              aria-label={`Open ${tool.label}`}
              className="text-left"
              onClick={() => onOpenTool(tool.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpenTool(tool.id)
                }
              }}
            >
              <div className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--garden-primary-soft) text-(--garden-primary-dark)">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-semibold text-(--garden-text)">{tool.label}</p>
                  <p className="text-sm leading-relaxed text-(--garden-text-muted)">{tool.description}</p>
                  <p className="text-xs font-medium text-primary">Open</p>
                </div>
              </div>
            </AppSurface>
          )
        })}
      </div>
    </section>
  )
}
