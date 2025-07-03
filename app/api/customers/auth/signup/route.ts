import { type NextRequest, NextResponse } from "next/server"
import { createCustomer, generateCustomerToken } from "@/lib/services/customers"

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json()

    if (!customerData.email || !customerData.password || !customerData.name || !customerData.phone) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const customer = await createCustomer(customerData)

    if (!customer) {
      return NextResponse.json({ error: "Failed to create customer account" }, { status: 500 })
    }

    const token = generateCustomerToken(customer)

    return NextResponse.json(
      {
        customer,
        token,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Customer signup error:", error)
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
