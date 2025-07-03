"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "@/contexts/websocket-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, LogOut, Scissors, User, Loader2 } from "lucide-react"

interface Employee {
  id: string
  name: string
  position: string
  email: string
  phone: string
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeStatus, setEmployeeStatus] = useState<Record<string, "in" | "out">>({})
  const [isLoading, setIsLoading] = useState(true)
  const { punchInOut, attendanceRecords } = useWebSocket()

  const fetchEmployees = async () => {
    try {
      // For public attendance page, we'll fetch without auth
      // In a real app, you might want a separate public endpoint
      const response = await fetch("/api/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    // Update employee status based on latest attendance records
    const status: Record<string, "in" | "out"> = {}

    employees.forEach((employee) => {
      const employeeRecords = attendanceRecords
        .filter((record) => record.employeeId === employee.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      if (employeeRecords.length > 0) {
        status[employee.id] = employeeRecords[0].action === "punch_in" ? "in" : "out"
      } else {
        status[employee.id] = "out"
      }
    })

    setEmployeeStatus(status)
  }, [employees, attendanceRecords])

  const handlePunchInOut = (employee: Employee) => {
    const currentStatus = employeeStatus[employee.id] || "out"
    const newAction = currentStatus === "out" ? "punch_in" : "punch_out"

    punchInOut(employee.id, employee.name, newAction)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Scissors className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Parlour Attendance</CardTitle>
            <CardDescription className="text-lg">Employee Punch In/Out System</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="font-mono">{getCurrentTime()}</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <span>{getCurrentDate()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Employee Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => {
            const status = employeeStatus[employee.id] || "out"
            const isIn = status === "in"

            return (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.position}</CardDescription>
                    </div>
                    <Badge variant={isIn ? "default" : "secondary"}>{isIn ? "Checked In" : "Checked Out"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handlePunchInOut(employee)}
                    className={`w-full ${isIn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                    size="lg"
                  >
                    {isIn ? (
                      <>
                        <LogOut className="h-5 w-5 mr-2" />
                        Punch Out
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        Punch In
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {employees.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employees found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please add employees from the admin dashboard first.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {attendanceRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest punch in/out records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant={record.action === "punch_in" ? "default" : "secondary"}>
                      {record.action === "punch_in" ? "Punch In" : "Punch Out"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
