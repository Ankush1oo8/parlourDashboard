import type { ObjectId } from "mongodb"

export interface AttendanceRecord {
  _id?: ObjectId
  id?: string
  employeeId: string
  employeeName: string
  action: "punch_in" | "punch_out"
  timestamp: Date
  createdAt?: Date
}
