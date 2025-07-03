"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, LogOut, User, Scissors, CheckCircle, ArrowRight, MapPin, Smartphone, Wifi } from "lucide-react"

interface Employee {
  id: string
  name: string
  position: string
  status: "out" | "in"
  lastAction?: Date
}

interface AttendanceStep {
  step: number
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

export default function AttendanceFlowPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "Sarah Johnson", position: "Hair Stylist", status: "out" },
    { id: "2", name: "Mike Chen", position: "Nail Technician", status: "out" },
    {
      id: "3",
      name: "Emma Davis",
      position: "Makeup Artist",
      status: "in",
      lastAction: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const attendanceSteps: AttendanceStep[] = [
    {
      step: 1,
      title: "Employee Arrives",
      description: "Staff member arrives at the parlour and accesses the attendance system",
      icon: <MapPin className="h-6 w-6" />,
      completed: currentStep > 0,
    },
    {
      step: 2,
      title: "Select Employee",
      description: "Employee finds their name on the attendance interface",
      icon: <User className="h-6 w-6" />,
      completed: currentStep > 1,
    },
    {
      step: 3,
      title: "Punch In/Out",
      description: "Employee clicks the punch in or punch out button",
      icon: <Clock className="h-6 w-6" />,
      completed: currentStep > 2,
    },
    {
      step: 4,
      title: "Real-time Update",
      description: "System immediately updates attendance status and notifies admin dashboard",
      icon: <Wifi className="h-6 w-6" />,
      completed: currentStep > 3,
    },
    {
      step: 5,
      title: "Database Storage",
      description: "Attendance record is permanently stored in MongoDB with timestamp",
      icon: <CheckCircle className="h-6 w-6" />,
      completed: currentStep > 4,
    },
  ]

  const handlePunchInOut = (employee: Employee) => {
    const newStatus = employee.status === "out" ? "in" : "out"
    const updatedEmployees = employees.map((emp) =>
      emp.id === employee.id ? { ...emp, status: newStatus, lastAction: new Date() } : emp,
    )
    setEmployees(updatedEmployees)
    setSelectedEmployee({ ...employee, status: newStatus, lastAction: new Date() })

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setSelectedEmployee(null)
    setEmployees([
      { id: "1", name: "Sarah Johnson", position: "Hair Stylist", status: "out" },
      { id: "2", name: "Mike Chen", position: "Nail Technician", status: "out" },
      {
        id: "3",
        name: "Emma Davis",
        position: "Makeup Artist",
        status: "in",
        lastAction: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ])
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Scissors className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Attendance System Flow Demo</CardTitle>
            <CardDescription className="text-lg">See how employees mark their attendance in real-time</CardDescription>
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Flow Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Process Flow</CardTitle>
              <CardDescription>Step-by-step attendance marking process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      step.completed
                        ? "bg-green-50 border-green-200"
                        : currentStep === index
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : currentStep === index
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        Step {step.step}: {step.title}
                        {step.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={resetDemo} variant="outline" className="flex-1 bg-transparent">
                  Reset Demo
                </Button>
                {currentStep < 1 && (
                  <Button onClick={() => setCurrentStep(1)} className="flex-1">
                    Start Demo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Live Attendance Interface</CardTitle>
              <CardDescription>Interactive employee attendance system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => {
                  const isIn = employee.status === "in"
                  const isSelected = selectedEmployee?.id === employee.id

                  return (
                    <div
                      key={employee.id}
                      className={`p-4 border rounded-lg transition-all ${
                        isSelected ? "border-purple-300 bg-purple-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
                        <Badge variant={isIn ? "default" : "secondary"}>{isIn ? "Checked In" : "Checked Out"}</Badge>
                      </div>

                      {employee.lastAction && (
                        <p className="text-xs text-muted-foreground mb-3">
                          Last action: {employee.lastAction.toLocaleString()}
                        </p>
                      )}

                      <Button
                        onClick={() => {
                          if (currentStep >= 1) {
                            setCurrentStep(Math.max(2, currentStep))
                            handlePunchInOut(employee)
                          }
                        }}
                        disabled={currentStep < 1}
                        className={`w-full ${isIn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                        size="lg"
                      >
                        {isIn ? (
                          <>
                            <LogOut className="h-4 w-4 mr-2" />
                            Punch Out
                          </>
                        ) : (
                          <>
                            <LogIn className="h-4 w-4 mr-2" />
                            Punch In
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>

              {selectedEmployee && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Action Recorded!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {selectedEmployee.name} has {selectedEmployee.status === "in" ? "punched in" : "punched out"}{" "}
                    successfully. The record has been saved to the database with timestamp.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>How the attendance system works behind the scenes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Frontend Interface
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React-based attendance UI</li>
                  <li>• Real-time status updates</li>
                  <li>• Touch-friendly interface</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                  API Processing
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• POST /api/attendance</li>
                  <li>• Validates employee data</li>
                  <li>• Generates unique record ID</li>
                  <li>• Timestamps each action</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Database Storage
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• MongoDB collection</li>
                  <li>• Permanent record storage</li>
                  <li>• Indexed for fast queries</li>
                  <li>• Real-time dashboard sync</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
