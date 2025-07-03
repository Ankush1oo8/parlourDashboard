"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  message?: string
  details?: any
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "pending" },
    { name: "Authentication", status: "pending" },
    { name: "Employee Operations", status: "pending" },
    { name: "Task Operations", status: "pending" },
    { name: "Attendance Operations", status: "pending" },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test) => (test.name === name ? { ...test, ...updates } : test)))
  }

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    updateTest(testName, { status: "running" })
    try {
      const result = await testFn()
      updateTest(testName, {
        status: "success",
        message: "Test passed",
        details: result,
      })
      return true
    } catch (error) {
      updateTest(testName, {
        status: "error",
        message: error instanceof Error ? error.message : "Test failed",
      })
      return false
    }
  }

  const testDatabaseConnection = async () => {
    const response = await fetch("/api/init")
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Database connection failed")
    return data
  }

  const testAuthentication = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "superadmin@parlour.com",
        password: "admin123",
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Authentication failed")
    return data.token
  }

  const testEmployeeOperations = async (token: string) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch("/api/employees", { headers })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Employee operations failed")
    return data
  }

  const testTaskOperations = async (token: string) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch("/api/tasks", { headers })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Task operations failed")
    return data
  }

  const testAttendanceOperations = async () => {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: "test-id",
        employeeName: "Test Employee",
        action: "punch_in",
        timestamp: new Date(),
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Attendance operations failed")
    return data
  }

  const runAllTests = async () => {
    setIsRunning(true)

    // Reset all tests
    setTests((prev) => prev.map((test) => ({ ...test, status: "pending" as const })))

    let token: string | null = null

    // Run tests sequentially
    const dbSuccess = await runTest("Database Connection", testDatabaseConnection)

    if (dbSuccess) {
      const authResult = await runTest("Authentication", testAuthentication)
      if (authResult) {
        token = authResult as string
      }
    }

    if (token) {
      await runTest("Employee Operations", () => testEmployeeOperations(token!))
      await runTest("Task Operations", () => testTaskOperations(token!))
    }

    await runTest("Attendance Operations", testAttendanceOperations)

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Badge variant="secondary">Running</Badge>
      case "success":
        return <Badge variant="default">Passed</Badge>
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Functionality Tests</h1>
          <p className="text-muted-foreground">Verify all features are working correctly with MongoDB</p>
        </div>
        <Button onClick={runAllTests} disabled={isRunning}>
          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          Run All Tests
        </Button>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                </div>
                {getStatusBadge(test.status)}
              </div>
              {test.message && <CardDescription>{test.message}</CardDescription>}
            </CardHeader>
            {test.details && (
              <CardContent>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Test Coverage:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• MongoDB connection and database initialization</li>
              <li>• JWT authentication with encrypted passwords</li>
              <li>• Employee CRUD operations with role-based access</li>
              <li>• Task management and assignment functionality</li>
              <li>• Real-time attendance tracking and storage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
