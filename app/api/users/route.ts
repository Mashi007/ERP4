import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        r.name as role,
        u.status,
        u.last_login,
        u.created_at,
        COALESCE(
          json_agg(
            DISTINCT p.name
          ) FILTER (WHERE p.name IS NOT NULL), 
          '[]'::json
        ) as permissions
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      GROUP BY u.id, u.name, u.email, r.name, u.status, u.last_login, u.created_at
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, roleId } = await request.json()

    // In a real implementation, you would hash the password
    const hashedPassword = password // This should be properly hashed

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role_id)
      VALUES (${name}, ${email}, ${hashedPassword}, ${roleId})
      RETURNING id, name, email, status, created_at
    `

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
