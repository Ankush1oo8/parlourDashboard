import type { ObjectId } from "mongodb"

export interface Task {
  _id?: ObjectId
  id?: string
  title: string
  assignedTo: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt?: Date
  updatedAt?: Date
}
