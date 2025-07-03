"use client"

import { useWebSocket } from "@/contexts/websocket-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User } from "lucide-react"

export default function AttendancePage() {
  const { attendanceRecords } = useWebSocket()

  const todayRecords = attendanceRecords.filter((record) => {
    const today = new Date().toDateString()
    const recordDate = new Date(record.timestamp).toDateString()
    return today === recordDate
  })

  const groupedRecords = attendanceRecords.reduce(
    (acc, record) => {
      const date = new Date(record.timestamp).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(record)
      return acc
    },
    {} as Record<string, typeof attendanceRecords>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Logs</h1>
        <p className="text-muted-foreground">View real-time attendance tracking for all employees</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Records</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords.length}</div>
            <p className="text-xs text-muted-foreground">Punch in/out activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(attendanceRecords.map((r) => r.employeeId)).size}</div>
            <p className="text-xs text-muted-foreground">Unique employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedRecords)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, records]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription>{records.length} attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </p>
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
          ))}

        {attendanceRecords.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Records will appear here when employees punch in/out from the attendance page.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
