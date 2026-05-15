export function getGardenGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready for some gardening?'
  if (hour < 17) return "Good afternoon! How's the garden today?"
  return 'Good evening! Time to relax and enjoy your garden.'
}
