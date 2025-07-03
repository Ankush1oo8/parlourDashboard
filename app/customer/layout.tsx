"use client"

import type React from "react"
import { CustomerAuthProvider } from "@/contexts/customer-auth-context"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CustomerAuthProvider>{children}</CustomerAuthProvider>
}
