import { neon } from "@neondatabase/serverless"

export async function getUsers() {
  // Default users to return if anything fails
  const defaultUsers = [
    { id: "admin-1", name: "María García", email: "admin@empresa.com", role: "Administrador" },
    { id: "comercial-1", name: "Carlos Rodríguez", email: "comercial@empresa.com", role: "Comercial" },
  ]

  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log("[v0] DATABASE_URL not available, using default users")
      return defaultUsers
    }

    const sql = neon(process.env.DATABASE_URL)

    const users = await sql`
      SELECT u.id, u.name, u.email, u.created_at, u.updated_at, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.status = 'active'
      ORDER BY u.name ASC
    `

    console.log("[v0] Database users query result:", users.length, "users found")

    if (users.length > 0) {
      const mappedUsers = users.map((user) => ({
        id: user.id.toString(),
        name: user.name || user.email?.split("@")[0] || "Usuario",
        email: user.email,
        role: user.role || "Usuario",
      }))
      console.log("[v0] Returning database users:", mappedUsers.length)
      return mappedUsers
    }
  } catch (error) {
    console.error("[v0] Error fetching users from database:", error)
  }

  // Always return default users if anything fails
  console.log("[v0] Returning default users")
  return defaultUsers
}
