import { NextResponse } from "next/server"
import { createDefaultUsers } from "@/lib/services/auth"
import { createDefaultEmployees } from "@/lib/services/employees"
import { createDefaultTasks } from "@/lib/services/tasks"
import { getDatabase } from "@/lib/mongodb"
import { createDefaultAppointments } from "@/lib/services/appointments"

export async function POST() {
  try {
    // Test database connection first
    const db = await getDatabase()
    await db.admin().ping()
    console.log("✅ MongoDB connection successful")

    // Initialize collections
    await createDefaultUsers()
    console.log("✅ Default users created")

    await createDefaultEmployees()
    console.log("✅ Default employees created")

    await createDefaultTasks()
    console.log("✅ Default tasks created")

    await createDefaultAppointments()
    console.log("✅ Default appointments created")

    return NextResponse.json({
      message: "Database initialized successfully",
      status: "success",
      collections: {
        users: "✅ Created with default admin accounts",
        employees: "✅ Created with sample employees",
        tasks: "✅ Created with sample tasks",
        attendance: "✅ Ready for records",
        appointments: "✅ Created with sample appointments",
      },
    })
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
        status: "failed",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const db = await getDatabase()

    // Check collections status
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    const userCount = await db.collection("users").countDocuments()
    const employeeCount = await db.collection("employees").countDocuments()
    const taskCount = await db.collection("tasks").countDocuments()
    const attendanceCount = await db.collection("attendance").countDocuments()

    return NextResponse.json({
      status: "connected",
      database: "parlour_dashboard",
      collections: collectionNames,
      counts: {
        users: userCount,
        employees: employeeCount,
        tasks: taskCount,
        attendance: attendanceCount,
      },
    })
  } catch (error) {
    console.error("❌ Database status check failed:", error)
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
