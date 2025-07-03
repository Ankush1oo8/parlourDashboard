"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  dateOfBirth?: Date
  preferences?: {
    services: string[]
    preferredStaff?: string[]
    notes?: string
  }
}

interface CustomerAuthContextType {
  customer: Customer | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (customerData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem("customer_auth_token")
    const customerData = localStorage.getItem("customer_data")

    if (savedToken && customerData) {
      setToken(savedToken)
      setCustomer(JSON.parse(customerData))
    }
    setIsLoading(false)
  }, [])

  const signup = async (customerData: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/customers/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setToken(data.token)
        localStorage.setItem("customer_auth_token", data.token)
        localStorage.setItem("customer_data", JSON.stringify(data.customer))

        toast({
          title: "Account Created",
          description: "Welcome to our parlour! Your account has been created successfully.",
        })

        router.push("/customer/dashboard")
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
      const response = await fetch("/api/customers/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setToken(data.token)
        localStorage.setItem("customer_auth_token", data.token)
        localStorage.setItem("customer_data", JSON.stringify(data.customer))

        toast({
          title: "Welcome Back",
          description: `Hello ${data.customer.name}! You're now logged in.`,
        })

        router.push("/customer/dashboard")
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
    setCustomer(null)
    setToken(null)
    localStorage.removeItem("customer_auth_token")
    localStorage.removeItem("customer_data")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/customer/login")
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, login, signup, logout, isLoading, token }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider")
  }
  return context
}
