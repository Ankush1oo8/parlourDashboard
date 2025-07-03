import { type NextRequest, NextResponse } from "next/server"
import { authenticateEmployee, generateEmployeeToken } from "@/lib/services/employee-auth"
import { createAttendanceRecord } from "@/lib/services/attendance"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const employee = await authenticateEmployee(email, password)

    if (!employee) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Auto-mark attendance when employee logs in
    await createAttendanceRecord({
      employeeId: employee.id,
      employeeName: employee.name,
      action: "punch_in",
      timestamp: new Date(),
    })

    const token = generateEmployeeToken(employee)

    return NextResponse.json({
      employee,
      token,
      message: "Login successful - attendance marked",
    })
  } catch (error) {
    console.error("Employee login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
