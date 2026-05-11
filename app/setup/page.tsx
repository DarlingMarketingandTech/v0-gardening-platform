"use client"

import { redirect } from "next/navigation"

export default function SetupPage() {
  // Setup is no longer needed - redirect to garden
  redirect('/my-garden')
}
