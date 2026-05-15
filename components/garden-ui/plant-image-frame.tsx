'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const sizeClass = {
  sm: 'size-12 rounded-md',
  md: 'size-20 rounded-xl',
  lg: 'size-28 rounded-xl',
  wide: 'aspect-[4/3] w-full max-w-[min(100%,20rem)] rounded-[length:var(--garden-radius-card)]',
} as const

export interface PlantImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt: string
  fallback?: React.ReactNode
  size?: keyof typeof sizeClass
}

export function PlantImageFrame({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}: PlantImageFrameProps) {
  const [failed, setFailed] = React.useState(false)
  const showImg = Boolean(src) && !failed

  return (
    <div
      data-slot="garden-plant-image-frame"
      className={cn(
        'relative overflow-hidden border border-[color-mix(in_oklch,var(--garden-primary)_18%,var(--garden-border))] bg-[var(--garden-surface-muted)] shadow-[var(--garden-shadow-soft)]',
        size !== 'wide' ? 'shrink-0' : '',
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          className={cn('size-full object-cover', size === 'wide' && 'absolute inset-0')}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex size-full items-center justify-center p-2 text-center text-sm text-[var(--garden-text-muted)]"
          role="img"
          aria-label={alt}
        >
          {fallback ?? <span aria-hidden>🌿</span>}
        </div>
      )}
    </div>
  )
}
