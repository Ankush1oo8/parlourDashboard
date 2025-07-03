import { getDatabase } from "@/lib/mongodb"
import type { Appointment } from "@/lib/models/customer"
import { ObjectId } from "mongodb"

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const db = await getDatabase()
    const appointments = await db.collection<Appointment>("appointments").find({}).sort({ date: 1 }).toArray()

    return appointments.map((appointment) => ({
      ...appointment,
      id: appointment._id!.toString(),
    }))
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function getCustomerAppointments(customerId: string): Promise<Appointment[]> {
  try {
    const db = await getDatabase()
    const appointments = await db
      .collection<Appointment>("appointments")
      .find({ customerId })
      .sort({ date: -1 })
      .toArray()

    return appointments.map((appointment) => ({
      ...appointment,
      id: appointment._id!.toString(),
    }))
  } catch (error) {
    console.error("Error fetching customer appointments:", error)
    return []
  }
}

export async function createAppointment(
  appointmentData: Omit<Appointment, "_id" | "id" | "createdAt" | "updatedAt">,
): Promise<Appointment | null> {
  try {
    const db = await getDatabase()
    const appointment: Omit<Appointment, "_id" | "id"> = {
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Appointment>("appointments").insertOne(appointment as Appointment)

    return {
      ...appointment,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return null
  }
}

export async function updateAppointment(
  id: string,
  appointmentData: Partial<Appointment>,
): Promise<Appointment | null> {
  try {
    const db = await getDatabase()
    const updateData = {
      ...appointmentData,
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Appointment>("appointments")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (result) {
      return {
        ...result,
        id: result._id!.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Error updating appointment:", error)
    return null
  }
}

export async function createDefaultAppointments() {
  try {
    const db = await getDatabase()
    const appointmentsCollection = db.collection<Appointment>("appointments")

    // Check if appointments already exist
    const existingAppointments = await appointmentsCollection.countDocuments()
    if (existingAppointments > 0) {
      return
    }

    // Create default appointments
    const defaultAppointments: Omit<Appointment, "_id">[] = [
      {
        customerId: "sample-customer-1",
        customerName: "Alice Johnson",
        customerEmail: "alice@example.com",
        service: "Hair Cut & Style",
        assignedStaff: "Sarah Johnson",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: "10:00 AM",
        duration: 60,
        status: "scheduled",
        notes: "Regular customer, prefers layered cut",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        customerId: "sample-customer-2",
        customerName: "Bob Smith",
        customerEmail: "bob@example.com",
        service: "Manicure & Pedicure",
        assignedStaff: "Mike Chen",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: "2:00 PM",
        duration: 90,
        status: "scheduled",
        notes: "First time customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await appointmentsCollection.insertMany(defaultAppointments)
    console.log("Default appointments created successfully")
  } catch (error) {
    console.error("Error creating default appointments:", error)
  }
}
