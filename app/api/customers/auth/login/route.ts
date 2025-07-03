import { type NextRequest, NextResponse } from "next/server"
import { authenticateCustomer, generateCustomerToken } from "@/lib/services/customers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const customer = await authenticateCustomer(email, password)

    if (!customer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateCustomerToken(customer)

    return NextResponse.json({
      customer,
      token,
    })
  } catch (error) {
    console.error("Customer login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
