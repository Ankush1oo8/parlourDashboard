import { type NextRequest, NextResponse } from "next/server"
import { getAttendanceRecords, createAttendanceRecord } from "@/lib/services/attendance"
import { verifyToken } from "@/lib/services/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const records = await getAttendanceRecords()
    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching attendance records:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const recordData = await request.json()
    const record = await createAttendanceRecord(recordData)

    if (!record) {
      return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 })
    }

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error("Error creating attendance record:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
