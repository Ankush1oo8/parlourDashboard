"use client"

import { useEmployeeAuth } from "@/contexts/employee-auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ClipboardList, User, Phone, Mail, LogOut, Scissors, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  assignedTo: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
}

export default function EmployeeDashboardPage() {
  const { employee, logout, token, isLoading } = useEmployeeAuth()
  const { attendanceRecords, punchInOut } = useWebSocket()
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !employee) {
      router.push("/login")
    }
  }, [employee, isLoading, router])

  const fetchMyTasks = async () => {
    if (!token || !employee) return

    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Use admin token for now
        },
      })

      if (response.ok) {
        const allTasks = await response.json()
        // Filter tasks assigned to this employee
        const employeeTasks = allTasks.filter((task: Task) => task.assignedTo === employee.name)
        setMyTasks(employeeTasks)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoadingTasks(false)
    }
  }

  useEffect(() => {
    fetchMyTasks()
  }, [token, employee])

  const handlePunchOut = () => {
    if (employee) {
      punchInOut(employee.id, employee.name, "punch_out")
    }
  }

  const myAttendanceRecords = attendanceRecords.filter((record) => record.employeeId === employee?.id)
  const todayRecords = myAttendanceRecords.filter((record) => {
    const today = new Date().toDateString()
    const recordDate = new Date(record.timestamp).toDateString()
    return today === recordDate
  })

  const isCurrentlyIn = todayRecords.length > 0 && todayRecords[0].action === "punch_in"
  const pendingTasks = myTasks.filter((task) => task.status === "pending")
  const inProgressTasks = myTasks.filter((task) => task.status === "in_progress")
  const completedTasks = myTasks.filter((task) => task.status === "completed")

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!employee) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Scissors className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {employee.name}!</h1>
              <p className="text-muted-foreground">Your personal dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCurrentlyIn && (
              <Button onClick={handlePunchOut} variant="outline" className="bg-red-50 border-red-200">
                <LogOut className="h-4 w-4 mr-2" />
                Punch Out
              </Button>
            )}
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={isCurrentlyIn ? "default" : "secondary"}>
                  {isCurrentlyIn ? "Checked In" : "Checked Out"}
                </Badge>
                {isCurrentlyIn && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{todayRecords.length} records today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tasks to start</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tasks done</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p className="font-semibold">{employee.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Your punch in/out records for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayRecords.length > 0 ? (
                <div className="space-y-2">
                  {todayRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{new Date(record.timestamp).toLocaleTimeString()}</span>
                      <Badge variant={record.action === "punch_in" ? "default" : "secondary"}>
                        {record.action === "punch_in" ? "Punch In" : "Punch Out"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No records for today</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : myTasks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {myTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{task.title}</h3>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
