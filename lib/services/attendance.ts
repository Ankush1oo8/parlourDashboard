import { getDatabase } from "@/lib/mongodb"
import type { AttendanceRecord } from "@/lib/models/attendance"

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const db = await getDatabase()
    const records = await db.collection<AttendanceRecord>("attendance").find({}).sort({ timestamp: -1 }).toArray()

    return records.map((record) => ({
      ...record,
      id: record._id!.toString(),
    }))
  } catch (error) {
    console.error("Error fetching attendance records:", error)
    return []
  }
}

export async function createAttendanceRecord(
  recordData: Omit<AttendanceRecord, "_id" | "id" | "createdAt">,
): Promise<AttendanceRecord | null> {
  try {
    const db = await getDatabase()
    const record: Omit<AttendanceRecord, "_id" | "id"> = {
      ...recordData,
      createdAt: new Date(),
    }

    const result = await db.collection<AttendanceRecord>("attendance").insertOne(record as AttendanceRecord)

    return {
      ...record,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    }
  } catch (error) {
    console.error("Error creating attendance record:", error)
    return null
  }
}

export async function getLatestAttendanceByEmployee(employeeId: string): Promise<AttendanceRecord | null> {
  try {
    const db = await getDatabase()
    const record = await db
      .collection<AttendanceRecord>("attendance")
      .findOne({ employeeId }, { sort: { timestamp: -1 } })

    if (record) {
      return {
        ...record,
        id: record._id!.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching latest attendance:", error)
    return null
  }
}
