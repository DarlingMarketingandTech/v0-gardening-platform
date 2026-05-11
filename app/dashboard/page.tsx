"use client"

import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to /my-garden - this is the new main garden view
  redirect('/my-garden')
}
