import { type NextRequest, NextResponse } from "next/server"
import { getCustomerAppointments, createAppointment } from "@/lib/services/appointments"
import { verifyCustomerToken } from "@/lib/services/customers"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customer = verifyCustomerToken(token)
    if (!customer) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const appointments = await getCustomerAppointments(customer.id)
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching customer appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customer = verifyCustomerToken(token)
    if (!customer) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const appointmentData = await request.json()

    // Add customer info to appointment
    const appointment = await createAppointment({
      ...appointmentData,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
    })

    if (!appointment) {
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
