"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  phone: string
  isActive?: boolean
}

interface EmployeeAuthContextType {
  employee: Employee | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (employeeData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined)

export function EmployeeAuthProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const savedToken = localStorage.getItem("employee_auth_token")
    const employeeData = localStorage.getItem("employee_data")

    if (savedToken && employeeData) {
      setToken(savedToken)
      setEmployee(JSON.parse(employeeData))
    }
    setIsLoading(false)
  }, [])

  const signup = async (employeeData: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/employees/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      if (response.ok) {
        const data = await response.json()
        setEmployee(data.employee)
        setToken(data.token)
        localStorage.setItem("employee_auth_token", data.token)
        localStorage.setItem("employee_data", JSON.stringify(data.employee))

        toast({
          title: "Account Created",
          description: "Welcome to the team! Your account has been created successfully.",
        })

        router.push("/employee/dashboard")
        return true
      } else {
        const error = await response.json()
        toast({
          title: "Signup Failed",
          description: error.error || "Failed to create account",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/employees/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setEmployee(data.employee)
        setToken(data.token)
        localStorage.setItem("employee_auth_token", data.token)
        localStorage.setItem("employee_data", JSON.stringify(data.employee))

        toast({
          title: "Welcome Back",
          description: `Hello ${data.employee.name}! Attendance marked automatically.`,
        })

        router.push("/employee/dashboard")
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
    setEmployee(null)
    setToken(null)
    localStorage.removeItem("employee_auth_token")
    localStorage.removeItem("employee_data")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <EmployeeAuthContext.Provider value={{ employee, login, signup, logout, isLoading, token }}>
      {children}
    </EmployeeAuthContext.Provider>
  )
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext)
  if (context === undefined) {
    throw new Error("useEmployeeAuth must be used within an EmployeeAuthProvider")
  }
  return context
}
