"use client"

import type React from "react"
import { EmployeeAuthProvider } from "@/contexts/employee-auth-context"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EmployeeAuthProvider>{children}</EmployeeAuthProvider>
}
