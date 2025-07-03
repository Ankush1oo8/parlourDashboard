import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, Users, Clock, User } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full">
              <Scissors className="h-16 w-16 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Parlour Management System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete solution for managing your beauty parlour with staff management, employee portal, and real-time
            attendance tracking.
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-16">
          {/* Staff/Admin Access */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Manage employees, tasks, and view attendance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Employee management</p>
                <p>• Task assignment and tracking</p>
                <p>• Real-time attendance monitoring</p>
                <p>• Role-based access control</p>
              </div>
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Employee Access */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Employee Portal</CardTitle>
              <CardDescription>Access your tasks, attendance, and personal dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p>• View assigned tasks</p>
                <p>• Automatic attendance marking</p>
                <p>• Personal dashboard</p>
                <p>• Punch in/out functionality</p>
              </div>
              <div className="space-y-2">
                <Link href="/login" className="block">
                  <Button className="w-full bg-transparent" variant="outline" size="lg">
                    Employee Login
                  </Button>
                </Link>
                <Link href="/employee/signup" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                    Create Employee Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-16">
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle>Real-time Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Track employee attendance with live updates and automatic login marking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Manage employee profiles, assign tasks, and monitor performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle>Employee Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Personal workspace for employees to view tasks and attendance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Link */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>See How It Works</CardTitle>
              <CardDescription>View the attendance system flow demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/attendance-flow">
                <Button variant="outline" className="w-full bg-transparent">
                  View Attendance Flow Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
