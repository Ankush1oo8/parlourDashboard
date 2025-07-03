"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export type UserRole = "super_admin" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
  initializeDatabase: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (savedToken && userData) {
      setToken(savedToken)
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const initializeDatabase = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/init", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Database Initialized",
          description: "Default users and data have been created successfully.",
        })
        return true
      } else {
        const error = await response.json()
        toast({
          title: "Initialization Failed",
          description: error.details || "Failed to initialize database",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Database initialization error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to database. Please check your connection.",
        variant: "destructive",
      })
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user_data", JSON.stringify(data.user))

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        })

        router.push("/dashboard")
        return true
      } else {
        const error = await response.json()
        toast({
          title: "Login Failed",
          description: error.error || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, token, initializeDatabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
