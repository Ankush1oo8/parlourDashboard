import { getDatabase } from "@/lib/mongodb"
import type { Employee } from "@/lib/models/employee"
import { ObjectId } from "mongodb"

export async function getEmployees(): Promise<Employee[]> {
  try {
    const db = await getDatabase()
    const employees = await db.collection<Employee>("employees").find({}).toArray()

    return employees.map((emp) => ({
      ...emp,
      id: emp._id!.toString(),
    }))
  } catch (error) {
    console.error("Error fetching employees:", error)
    return []
  }
}

export async function createEmployee(
  employeeData: Omit<Employee, "_id" | "id" | "createdAt" | "updatedAt">,
): Promise<Employee | null> {
  try {
    const db = await getDatabase()
    const employee: Omit<Employee, "_id" | "id"> = {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Employee>("employees").insertOne(employee as Employee)

    return {
      ...employee,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    }
  } catch (error) {
    console.error("Error creating employee:", error)
    return null
  }
}

export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
  try {
    const db = await getDatabase()
    const updateData = {
      ...employeeData,
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Employee>("employees")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (result) {
      return {
        ...result,
        id: result._id!.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Error updating employee:", error)
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    const result = await db.collection<Employee>("employees").deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting employee:", error)
    return false
  }
}

export async function createDefaultEmployees() {
  try {
    const db = await getDatabase()
    const employeesCollection = db.collection<Employee>("employees")

    // Check if employees already exist
    const existingEmployees = await employeesCollection.countDocuments()
    if (existingEmployees > 0) {
      return
    }

    // Create default employees
    const defaultEmployees: Omit<Employee, "_id">[] = [
      {
        name: "Sarah Johnson",
        position: "Hair Stylist",
        email: "sarah@parlour.com",
        phone: "+1234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mike Chen",
        position: "Nail Technician",
        email: "mike@parlour.com",
        phone: "+1234567891",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Emma Davis",
        position: "Makeup Artist",
        email: "emma@parlour.com",
        phone: "+1234567892",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await employeesCollection.insertMany(defaultEmployees)
    console.log("Default employees created successfully")
  } catch (error) {
    console.error("Error creating default employees:", error)
  }
}
