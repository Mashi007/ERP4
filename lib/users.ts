import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getUsers() {
  try {
    // Try to get users from the database
    const users = await sql`
      SELECT id, name, email, created_at, updated_at 
      FROM neon_auth.users_sync 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `

    if (users.length > 0) {
      return users.map((user) => ({
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "Usuario",
        email: user.email,
        role: "Usuario",
      }))
    }
  } catch (error) {
    console.error("Error fetching users from database:", error)
  }

  // Return default users if database query fails or is empty
  return [
    { id: "admin-1", name: "Administrador", email: "admin@empresa.com", role: "Administrador" },
    { id: "comercial-1", name: "Comercial Principal", email: "comercial@empresa.com", role: "Comercial" },
  ]
}
