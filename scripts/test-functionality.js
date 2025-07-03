// Test script to verify all functionality
const BASE_URL = "http://localhost:3000"

async function testDatabaseConnection() {
  console.log("🔍 Testing Database Connection...")

  try {
    const response = await fetch(`${BASE_URL}/api/init`)
    const data = await response.json()

    if (response.ok) {
      console.log("✅ Database Status:", data.status)
      console.log("📊 Collection Counts:", data.counts)
      return true
    } else {
      console.log("❌ Database connection failed:", data.error)
      return false
    }
  } catch (error) {
    console.log("❌ Network error:", error.message)
    return false
  }
}

async function testAuthentication() {
  console.log("\n🔐 Testing Authentication...")

  // Test Super Admin Login
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "superadmin@parlour.com",
        password: "admin123",
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Super Admin login successful")
      console.log("👤 User:", data.user.name, "- Role:", data.user.role)
      return data.token
    } else {
      console.log("❌ Login failed:", data.error)
      return null
    }
  } catch (error) {
    console.log("❌ Authentication error:", error.message)
    return null
  }
}

async function testEmployeeOperations(token) {
  console.log("\n👥 Testing Employee Operations...")

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  try {
    // Test GET employees
    const getResponse = await fetch(`${BASE_URL}/api/employees`, { headers })
    const employees = await getResponse.json()

    if (getResponse.ok) {
      console.log("✅ Fetch employees successful:", employees.length, "employees found")
    } else {
      console.log("❌ Fetch employees failed:", employees.error)
      return false
    }

    // Test CREATE employee
    const createResponse = await fetch(`${BASE_URL}/api/employees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Test Employee",
        position: "Test Position",
        email: "test@parlour.com",
        phone: "+1234567899",
      }),
    })

    const newEmployee = await createResponse.json()

    if (createResponse.ok) {
      console.log("✅ Create employee successful:", newEmployee.name)

      // Test UPDATE employee
      const updateResponse = await fetch(`${BASE_URL}/api/employees/${newEmployee.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: "Updated Test Employee",
          position: "Updated Position",
          email: "updated@parlour.com",
          phone: "+1234567899",
        }),
      })

      if (updateResponse.ok) {
        console.log("✅ Update employee successful")
      } else {
        console.log("❌ Update employee failed")
      }

      // Test DELETE employee
      const deleteResponse = await fetch(`${BASE_URL}/api/employees/${newEmployee.id}`, {
        method: "DELETE",
        headers,
      })

      if (deleteResponse.ok) {
        console.log("✅ Delete employee successful")
      } else {
        console.log("❌ Delete employee failed")
      }

      return true
    } else {
      console.log("❌ Create employee failed:", newEmployee.error)
      return false
    }
  } catch (error) {
    console.log("❌ Employee operations error:", error.message)
    return false
  }
}

async function testTaskOperations(token) {
  console.log("\n📋 Testing Task Operations...")

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  try {
    // Test GET tasks
    const getResponse = await fetch(`${BASE_URL}/api/tasks`, { headers })
    const tasks = await getResponse.json()

    if (getResponse.ok) {
      console.log("✅ Fetch tasks successful:", tasks.length, "tasks found")
      return true
    } else {
      console.log("❌ Fetch tasks failed:", tasks.error)
      return false
    }
  } catch (error) {
    console.log("❌ Task operations error:", error.message)
    return false
  }
}

async function testAttendanceOperations() {
  console.log("\n⏰ Testing Attendance Operations...")

  try {
    // Test CREATE attendance record
    const createResponse = await fetch(`${BASE_URL}/api/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: "test-employee-id",
        employeeName: "Test Employee",
        action: "punch_in",
        timestamp: new Date(),
      }),
    })

    const newRecord = await createResponse.json()

    if (createResponse.ok) {
      console.log("✅ Create attendance record successful")
      return true
    } else {
      console.log("❌ Create attendance record failed:", newRecord.error)
      return false
    }
  } catch (error) {
    console.log("❌ Attendance operations error:", error.message)
    return false
  }
}

async function runAllTests() {
  console.log("🚀 Starting Comprehensive Functionality Tests\n")

  const dbConnected = await testDatabaseConnection()
  if (!dbConnected) {
    console.log("\n❌ Database connection failed. Please check your MongoDB URI and run database initialization.")
    return
  }

  const token = await testAuthentication()
  if (!token) {
    console.log("\n❌ Authentication failed. Please initialize the database first.")
    return
  }

  const employeeOpsSuccess = await testEmployeeOperations(token)
  const taskOpsSuccess = await testTaskOperations(token)
  const attendanceOpsSuccess = await testAttendanceOperations()

  console.log("\n📊 Test Results Summary:")
  console.log("Database Connection:", dbConnected ? "✅" : "❌")
  console.log("Authentication:", token ? "✅" : "❌")
  console.log("Employee Operations:", employeeOpsSuccess ? "✅" : "❌")
  console.log("Task Operations:", taskOpsSuccess ? "✅" : "❌")
  console.log("Attendance Operations:", attendanceOpsSuccess ? "✅" : "❌")

  if (dbConnected && token && employeeOpsSuccess && taskOpsSuccess && attendanceOpsSuccess) {
    console.log("\n🎉 All tests passed! Your parlour dashboard is fully functional.")
  } else {
    console.log("\n⚠️  Some tests failed. Please check the errors above.")
  }
}

// Run tests if this script is executed directly
if (typeof window === "undefined") {
  runAllTests()
}

export { runAllTests }
