import { neon } from "@neondatabase/serverless"

export async function getUsers() {
  // Default users to return if anything fails
  const defaultUsers = [
    { id: "admin-1", name: "Administrador", email: "admin@empresa.com", role: "Administrador" },
    { id: "comercial-1", name: "Comercial Principal", email: "comercial@empresa.com", role: "Comercial" },
  ]

  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log("[v0] DATABASE_URL not available, using default users")
      return defaultUsers
    }

    const sql = neon(process.env.DATABASE_URL)

    // Try to get users from the database
    const users = await sql`
      SELECT id, name, email, created_at, updated_at 
      FROM neon_auth.users_sync 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `

    console.log("[v0] Database users query result:", users.length, "users found")

    if (users.length > 0) {
      const mappedUsers = users.map((user) => ({
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "Usuario",
        email: user.email,
        role: "Usuario",
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
