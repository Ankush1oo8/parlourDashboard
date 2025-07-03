import { getDatabase } from "@/lib/mongodb"
import type { Task } from "@/lib/models/task"
import { ObjectId } from "mongodb"

export async function getTasks(): Promise<Task[]> {
  try {
    const db = await getDatabase()
    const tasks = await db.collection<Task>("tasks").find({}).toArray()

    return tasks.map((task) => ({
      ...task,
      id: task._id!.toString(),
    }))
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function createTask(taskData: Omit<Task, "_id" | "id" | "createdAt" | "updatedAt">): Promise<Task | null> {
  try {
    const db = await getDatabase()
    const task: Omit<Task, "_id" | "id"> = {
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Task>("tasks").insertOne(task as Task)

    return {
      ...task,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    }
  } catch (error) {
    console.error("Error creating task:", error)
    return null
  }
}

export async function updateTask(id: string, taskData: Partial<Task>): Promise<Task | null> {
  try {
    const db = await getDatabase()
    const updateData = {
      ...taskData,
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Task>("tasks")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (result) {
      return {
        ...result,
        id: result._id!.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Error updating task:", error)
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    const result = await db.collection<Task>("tasks").deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting task:", error)
    return false
  }
}

export async function createDefaultTasks() {
  try {
    const db = await getDatabase()
    const tasksCollection = db.collection<Task>("tasks")

    // Check if tasks already exist
    const existingTasks = await tasksCollection.countDocuments()
    if (existingTasks > 0) {
      return
    }

    // Create default tasks
    const defaultTasks: Omit<Task, "_id">[] = [
      {
        title: "Client Consultation",
        assignedTo: "Sarah Johnson",
        status: "pending",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Inventory Check",
        assignedTo: "Mike Chen",
        status: "in_progress",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Equipment Maintenance",
        assignedTo: "Emma Davis",
        status: "completed",
        priority: "low",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await tasksCollection.insertMany(defaultTasks)
    console.log("Default tasks created successfully")
  } catch (error) {
    console.error("Error creating default tasks:", error)
  }
}
