'use client'

import confetti from 'canvas-confetti'

// Garden-themed confetti colors
const gardenColors = ['#22c55e', '#16a34a', '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899']

export function triggerHarvestConfetti() {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: gardenColors,
    shapes: ['circle', 'square'],
    ticks: 200
  })
  
  // Second burst with slight delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: gardenColors,
    })
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: gardenColors,
    })
  }, 150)
}

export function triggerSmallCelebration() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.7 },
    colors: gardenColors,
    scalar: 0.8,
    ticks: 100
  })
}
