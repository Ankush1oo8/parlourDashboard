import type { ObjectId } from "mongodb"

export interface Customer {
  _id?: ObjectId
  id?: string
  name: string
  email: string
  password: string
  phone: string
  address?: string
  dateOfBirth?: Date
  preferences?: {
    services: string[]
    preferredStaff?: string[]
    notes?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface CustomerResponse {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  dateOfBirth?: Date
  preferences?: {
    services: string[]
    preferredStaff?: string[]
    notes?: string
  }
}

export interface Appointment {
  _id?: ObjectId
  id?: string
  customerId: string
  customerName: string
  customerEmail: string
  service: string
  assignedStaff: string
  date: Date
  time: string
  duration: number // in minutes
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}
