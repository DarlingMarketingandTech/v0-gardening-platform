import { WeatherImpactChip } from '@/components/today/weather-impact-chip'

export interface ConditionStripProps {
  chips: string[]
  className?: string
}

export function ConditionStrip({ chips, className }: ConditionStripProps) {
  if (!chips.length) return null

  return (
    <div className={className}>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--garden-text-muted)]">
        Forecast snapshot
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((label) => (
          <WeatherImpactChip key={label} variant="soft">
            {label}
          </WeatherImpactChip>
        ))}
      </div>
    </div>
  )
}
