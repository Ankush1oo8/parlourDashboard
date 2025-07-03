import { type NextRequest, NextResponse } from "next/server"
import { createEmployeeAccount, generateEmployeeToken } from "@/lib/services/employee-auth"

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json()

    if (!employeeData.email || !employeeData.password || !employeeData.name || !employeeData.position) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const employee = await createEmployeeAccount(employeeData)

    if (!employee) {
      return NextResponse.json({ error: "Failed to create employee account" }, { status: 500 })
    }

    const token = generateEmployeeToken(employee)

    return NextResponse.json(
      {
        employee,
        token,
        message: "Employee account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Employee signup error:", error)
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
