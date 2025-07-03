import { getDatabase } from "@/lib/mongodb"
import type { Employee, EmployeeResponse } from "@/lib/models/employee"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function createEmployeeAccount(
  employeeData: Omit<Employee, "_id" | "id" | "createdAt" | "updatedAt"> & { password: string },
): Promise<EmployeeResponse | null> {
  try {
    const db = await getDatabase()

    // Check if employee already exists
    const existingEmployee = await db.collection<Employee>("employees").findOne({ email: employeeData.email })
    if (existingEmployee) {
      throw new Error("Employee with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(employeeData.password, 10)

    const employee: Omit<Employee, "_id" | "id"> = {
      ...employeeData,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Employee>("employees").insertOne(employee as Employee)

    return {
      id: result.insertedId.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone: employee.phone,
      isActive: employee.isActive,
    }
  } catch (error) {
    console.error("Error creating employee account:", error)
    return null
  }
}

export async function authenticateEmployee(email: string, password: string): Promise<EmployeeResponse | null> {
  try {
    const db = await getDatabase()
    const employee = await db.collection<Employee>("employees").findOne({ email, isActive: true })

    if (!employee || !employee.password) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, employee.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: employee._id!.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone: employee.phone,
      isActive: employee.isActive,
    }
  } catch (error) {
    console.error("Employee authentication error:", error)
    return null
  }
}

export function generateEmployeeToken(employee: EmployeeResponse): string {
  return jwt.sign(
    {
      id: employee.id,
      email: employee.email,
      name: employee.name,
      position: employee.position,
      type: "employee",
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

export function verifyEmployeeToken(token: string): EmployeeResponse | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.type !== "employee") return null

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      position: decoded.position,
    }
  } catch (error) {
    return null
  }
}
