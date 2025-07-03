import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id?: string
  email: string
  password: string
  name: string
  role: "super_admin" | "admin"
  createdAt?: Date
  updatedAt?: Date
}

export interface UserResponse {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin"
}
