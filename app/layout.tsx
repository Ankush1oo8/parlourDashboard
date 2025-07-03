import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { EmployeeAuthProvider } from "@/contexts/employee-auth-context"
import { WebSocketProvider } from "@/contexts/websocket-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Parlour Admin Dashboard",
  description: "Role-based admin dashboard for parlour management",
    generator: 'Ankush'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EmployeeAuthProvider>
            <WebSocketProvider>
              {children}
              <Toaster />
            </WebSocketProvider>
          </EmployeeAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
