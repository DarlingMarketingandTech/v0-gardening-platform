"use client"

// Profile store now only manages UI preferences
// Real user/household data comes from Supabase auth and household_members table

interface UIPreferences {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  dismissedMessages: string[]
}

const defaultPreferences: UIPreferences = {
  sidebarCollapsed: false,
  theme: 'system',
  dismissedMessages: [],
}

const STORAGE_KEY = 'momma-garden-ui'

export function getUIPreferences(): UIPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Error reading UI preferences:', e)
  }

  return defaultPreferences
}

export function setUIPreference<K extends keyof UIPreferences>(
  key: K,
  value: UIPreferences[K]
) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const prefs = getUIPreferences()
    prefs[key] = value
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {
    console.error('Error saving UI preferences:', e)
  }
}

export function toggleSidebar() {
  const prefs = getUIPreferences()
  setUIPreference('sidebarCollapsed', !prefs.sidebarCollapsed)
}

export function dismissMessage(messageId: string) {
  const prefs = getUIPreferences()
  if (!prefs.dismissedMessages.includes(messageId)) {
    prefs.dismissedMessages.push(messageId)
    setUIPreference('dismissedMessages', prefs.dismissedMessages)
  }
}

export function setTheme(theme: 'light' | 'dark' | 'system') {
  setUIPreference('theme', theme)
}
