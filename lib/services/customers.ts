import { getDatabase } from "@/lib/mongodb"
import type { Customer, CustomerResponse } from "@/lib/models/customer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function createCustomer(
  customerData: Omit<Customer, "_id" | "id" | "createdAt" | "updatedAt" | "password"> & { password: string },
): Promise<CustomerResponse | null> {
  try {
    const db = await getDatabase()

    // Check if customer already exists
    const existingCustomer = await db.collection<Customer>("customers").findOne({ email: customerData.email })
    if (existingCustomer) {
      throw new Error("Customer with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(customerData.password, 10)

    const customer: Omit<Customer, "_id" | "id"> = {
      ...customerData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Customer>("customers").insertOne(customer as Customer)

    return {
      id: result.insertedId.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      preferences: customer.preferences,
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    return null
  }
}

export async function authenticateCustomer(email: string, password: string): Promise<CustomerResponse | null> {
  try {
    const db = await getDatabase()
    const customer = await db.collection<Customer>("customers").findOne({ email })

    if (!customer) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, customer.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: customer._id!.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      preferences: customer.preferences,
    }
  } catch (error) {
    console.error("Customer authentication error:", error)
    return null
  }
}

export function generateCustomerToken(customer: CustomerResponse): string {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      type: "customer",
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyCustomerToken(token: string): CustomerResponse | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.type !== "customer") return null

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      phone: decoded.phone,
    }
  } catch (error) {
    return null
  }
}

export async function getCustomers(): Promise<CustomerResponse[]> {
  try {
    const db = await getDatabase()
    const customers = await db.collection<Customer>("customers").find({}).toArray()

    return customers.map((customer) => ({
      id: customer._id!.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      preferences: customer.preferences,
    }))
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<CustomerResponse | null> {
  try {
    const db = await getDatabase()
    const updateData = {
      ...customerData,
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Customer>("customers")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (result) {
      return {
        id: result._id!.toString(),
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        dateOfBirth: result.dateOfBirth,
        preferences: result.preferences,
      }
    }

    return null
  } catch (error) {
    console.error("Error updating customer:", error)
    return null
  }
}
