"use client"

import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ClipboardList, Clock, Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface Employee {
  id: string
  name: string
  position: string
}

interface Task {
  id: string
  title: string
  status: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const { attendanceRecords, isConnected, refreshAttendance } = useWebSocket()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    if (!token) return

    try {
      const [employeesRes, tasksRes] = await Promise.all([
        fetch("/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json()
        setEmployees(employeesData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchDashboardData(), refreshAttendance()])
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const todayAttendance = attendanceRecords.filter((record) => {
    const today = new Date().toDateString()
    const recordDate = new Date(record.timestamp).toDateString()
    return today === recordDate
  })

  const activeTasks = tasks.filter((task) => task.status !== "completed")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening at your parlour today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {isConnected ? (
            <Badge variant="secondary" className="gap-1">
              <Wifi className="h-3 w-3" />
              Live Updates Active
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedTasks.length} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance.length}</div>
            <p className="text-xs text-muted-foreground">Punch in/out records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">All time attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Latest punch in/out activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(record.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <Badge variant={record.action === "punch_in" ? "default" : "secondary"}>
                    {record.action === "punch_in" ? "Punch In" : "Punch Out"}
                  </Badge>
                </div>
              ))}
              {attendanceRecords.length === 0 && (
                <p className="text-sm text-muted-foreground">No attendance records yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>What you can do in this system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === "super_admin" ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge>Full Access</Badge>
                    <span className="text-sm">Add, edit, delete employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Full Access</Badge>
                    <span className="text-sm">Manage all tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Full Access</Badge>
                    <span className="text-sm">View and manage attendance</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">View Only</Badge>
                    <span className="text-sm">View employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">View Only</Badge>
                    <span className="text-sm">View tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">View Only</Badge>
                    <span className="text-sm">View attendance logs</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
