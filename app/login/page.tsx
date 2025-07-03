"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useEmployeeAuth } from "@/contexts/employee-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Scissors, Database, CheckCircle, Users, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [dbStatus, setDbStatus] = useState<"unknown" | "connected" | "error">("unknown")
  const [userType, setUserType] = useState<"admin" | "employee">("admin")

  const { login: adminLogin, initializeDatabase } = useAuth()
  const { login: employeeLogin } = useEmployeeAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    let success = false
    if (userType === "admin") {
      success = await adminLogin(email, password)
    } else {
      success = await employeeLogin(email, password)
    }

    if (!success) {
      setError("Invalid email or password. Try initializing the database first if this is your first time.")
    }
    setIsLoading(false)
  }

  const handleInitializeDB = async () => {
    setIsInitializing(true)
    setError("")

    const success = await initializeDatabase()
    if (success) {
      setDbStatus("connected")
    } else {
      setDbStatus("error")
    }
    setIsInitializing(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Scissors className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Parlour Login</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>

          {/* User Type Toggle */}
          <div className="flex w-full mt-4">
            <Button
              type="button"
              variant={userType === "admin" ? "default" : "outline"}
              className="flex-1 rounded-r-none"
              onClick={() => setUserType("admin")}
            >
              <Users className="h-4 w-4 mr-2" />
              Admin/Staff
            </Button>
            <Button
              type="button"
              variant={userType === "employee" ? "default" : "outline"}
              className="flex-1 rounded-l-none"
              onClick={() => setUserType("employee")}
            >
              <User className="h-4 w-4 mr-2" />
              Employee
            </Button>
          </div>

          {/* Database Status Indicator */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {dbStatus === "connected" && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                Database Connected
              </div>
            )}
            {dbStatus === "error" && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <Database className="h-4 w-4" />
                Database Not Initialized
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={userType === "admin" ? "admin@parlour.com" : "employee@parlour.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In as {userType === "admin" ? "Admin/Staff" : "Employee"}
              </Button>

              {userType === "admin" && dbStatus !== "connected" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleInitializeDB}
                  disabled={isInitializing}
                >
                  {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Database className="mr-2 h-4 w-4" />
                  Initialize Database
                </Button>
              )}

              {userType === "employee" && (
                <Link href="/employee/signup">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Create Employee Account
                  </Button>
                </Link>
              )}
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {userType === "admin" ? "Demo Admin Accounts:" : "Employee Access:"}
            </p>
            {userType === "admin" ? (
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Super Admin:</strong> superadmin@parlour.com / admin123
                </p>
                <p>
                  <strong>Admin:</strong> admin@parlour.com / admin123
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Employees can create their own accounts</p>
                <p>• Attendance is automatically marked on login</p>
                <p>• View your assigned tasks and schedule</p>
              </div>
            )}
            {userType === "admin" && (
              <p className="text-xs text-gray-500 mt-2">
                Click "Initialize Database" first if this is your first time using the app.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
