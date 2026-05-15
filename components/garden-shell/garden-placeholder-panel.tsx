interface GardenPlaceholderPanelProps {
  title: string
  description: string
}

export function GardenPlaceholderPanel({ title, description }: GardenPlaceholderPanelProps) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
    </section>
  )
}
