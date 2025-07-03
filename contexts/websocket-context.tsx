"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-context"

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  action: "punch_in" | "punch_out"
  timestamp: string
}

interface WebSocketContextType {
  attendanceRecords: AttendanceRecord[]
  isConnected: boolean
  punchInOut: (employeeId: string, employeeName: string, action: "punch_in" | "punch_out") => void
  refreshAttendance: () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  const fetchAttendanceRecords = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const records = await response.json()
        setAttendanceRecords(
          records.map((record: any) => ({
            ...record,
            timestamp: record.timestamp || record.createdAt,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchAttendanceRecords()
      setIsConnected(true)
    }
  }, [token])

  const punchInOut = async (employeeId: string, employeeName: string, action: "punch_in" | "punch_out") => {
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          employeeName,
          action,
          timestamp: new Date(),
        }),
      })

      if (response.ok) {
        const newRecord = await response.json()
        setAttendanceRecords((prev) => [newRecord, ...prev])

        toast({
          title: `${action === "punch_in" ? "Punched In" : "Punched Out"}`,
          description: `${employeeName} has ${action === "punch_in" ? "punched in" : "punched out"} successfully.`,
        })
      }
    } catch (error) {
      console.error("Error creating attendance record:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const refreshAttendance = () => {
    fetchAttendanceRecords()
  }

  return (
    <WebSocketContext.Provider
      value={{
        attendanceRecords,
        isConnected,
        punchInOut,
        refreshAttendance,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
