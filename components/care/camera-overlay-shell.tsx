'use client'

import { ActionPill } from '@/components/garden-ui/action-pill'
import { Button } from '@/components/ui/button'
import { getCareCopy } from '@/lib/care/care-copy'
import { cn } from '@/lib/utils'
import { ImageIcon, RotateCw, X, Zap } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface CameraOverlayShellProps {
  open: boolean
  onClose: () => void
  /** Called when user captures a frame from the live preview (JPEG data URL). */
  onCapturedImage?: (dataUrl: string) => void
  /** Camera unavailable or permission denied — offer upload path instead. */
  onFallbackUpload: () => void
  title?: string
}

/**
 * Full-screen scan overlay inspired by Figma structure (center guide line, top bar, bottom controls).
 * Uses lucide icons and garden tokens — no remote assets.
 */
export function CameraOverlayShell({
  open,
  onClose,
  onCapturedImage,
  onFallbackUpload,
  title = 'Identify a plant',
}: CameraOverlayShellProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [denied, setDenied] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    if (!open || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      if (open) setDenied(true)
      return
    }

    setDenied(false)
    setLoading(true)
    setVideoReady(false)

    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const el = videoRef.current
        if (el) {
          el.srcObject = stream
          void el.play().catch(() => setDenied(true))
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setDenied(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      stopStream()
    }
  }, [open, stopStream])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      stopStream()
      onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, stopStream])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || !videoReady || video.videoWidth === 0) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
    stopStream()
    onCapturedImage?.(dataUrl)
    onClose()
  }, [videoReady, stopStream, onCapturedImage, onClose])

  const handleFallback = () => {
    stopStream()
    onFallbackUpload()
    onClose()
  }

  if (!mounted || !open) return null

  const careCopy = getCareCopy()

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-100 flex flex-col bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/80 to-transparent" />

      <header className="relative z-10 grid grid-cols-[minmax(0,3.25rem)_1fr_minmax(0,3.25rem)] items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <div className="flex justify-start">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
            aria-label={flashOn ? 'Flash on (preview only)' : 'Flash off (preview only)'}
            aria-pressed={flashOn}
            onClick={() => setFlashOn((v) => !v)}
          >
            <Zap className={cn('size-5', flashOn && 'text-amber-300')} aria-hidden />
          </Button>
        </div>
        <h2 className="text-center text-base font-semibold tracking-tight">{title}</h2>
        <div className="flex justify-end">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
            aria-label="Close camera"
            onClick={() => {
              stopStream()
              onClose()
            }}
          >
            <X className="size-6" aria-hidden />
          </Button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
        {!denied && !loading ? (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover opacity-75"
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
          />
        ) : null}

        {loading ? (
          <p className="relative z-1 text-sm text-white/85">Starting camera…</p>
        ) : null}

        {denied ? (
          <div className="relative z-1 mx-6 max-w-sm space-y-4 rounded-(--garden-radius-card) border border-white/20 bg-black/50 p-6 text-center backdrop-blur-md">
            <p className="text-base font-semibold">Camera unavailable</p>
            <p className="text-sm leading-relaxed text-white/80">
              We can&apos;t access the camera right now. You can still identify a plant by uploading a photo from your
              library.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <ActionPill type="button" variant="primary" size="md" onClick={handleFallback}>
                Upload a photo
              </ActionPill>
              <ActionPill type="button" variant="ghost" size="md" className="border border-white/25 text-white hover:bg-white/10" onClick={onClose}>
                Close
              </ActionPill>
            </div>
          </div>
        ) : null}

        {!denied ? (
          <>
            <div
              className="relative z-1 h-px w-[55vw] max-w-md rounded-(--garden-radius-pill) bg-white shadow-[0_0_12px_rgba(255,255,255,0.35)]"
              aria-hidden
            />
            <span className="sr-only">Scan guide line</span>
          </>
        ) : null}
      </div>

      {!denied ? (
        <footer className="relative z-10 flex flex-col gap-3 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="flex justify-center">
            <button
              type="button"
              className="text-sm font-medium text-white/90 underline-offset-4 hover:underline"
              onClick={handleFallback}
            >
              {careCopy.sections.cameraUploadFromLibrary}
            </button>
          </div>
          <div className="flex items-center justify-between gap-6">
            <button
              type="button"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm"
              aria-label="Gallery (coming soon)"
              disabled
            >
              <ImageIcon className="size-7 opacity-70" aria-hidden />
            </button>

            <button
              type="button"
              className="relative flex size-18 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-[0_0_24px_rgba(255,255,255,0.25)] backdrop-blur-sm transition-transform active:scale-95 disabled:opacity-40"
              aria-label="Capture photo"
              disabled={!videoReady || loading}
              onClick={captureFrame}
            >
              <span className="size-14 rounded-full bg-white/90 shadow-inner" aria-hidden />
            </button>

            <button
              type="button"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm"
              aria-label="Rotate (coming soon)"
              disabled
            >
              <RotateCw className="size-7 opacity-70" aria-hidden />
            </button>
          </div>
        </footer>
      ) : null}
    </div>
  )

  return createPortal(overlay, document.body)
}
