import { getDatabase } from "@/lib/mongodb"
import type { User, UserResponse } from "@/lib/models/user"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function authenticateUser(email: string, password: string): Promise<UserResponse | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function generateToken(user: UserResponse): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

export function verifyToken(token: string): UserResponse | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}

export async function createDefaultUsers() {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if users already exist
    const existingUsers = await usersCollection.countDocuments()
    if (existingUsers > 0) {
      return
    }

    // Create default users
    const defaultUsers: Omit<User, "_id">[] = [
      {
        email: "superadmin@parlour.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Super Admin",
        role: "super_admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin@parlour.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await usersCollection.insertMany(defaultUsers)
    console.log("Default users created successfully")
  } catch (error) {
    console.error("Error creating default users:", error)
  }
}
