import type { ObjectId } from "mongodb"

export interface Employee {
  _id?: ObjectId
  id?: string
  name: string
  position: string
  email: string
  phone: string
  password?: string // Add password field for employee login
  isActive?: boolean // Add active status
  createdAt?: Date
  updatedAt?: Date
}

export interface EmployeeResponse {
  id: string
  name: string
  email: string
  position: string
  phone: string
  isActive?: boolean
}
