import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const roles = await sql`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.created_at,
        COUNT(u.id) as user_count,
        COALESCE(
          json_agg(
            DISTINCT p.name
          ) FILTER (WHERE p.name IS NOT NULL), 
          '[]'::json
        ) as permissions
      FROM roles r
      LEFT JOIN users u ON r.id = u.role_id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      GROUP BY r.id, r.name, r.description, r.created_at
      ORDER BY r.name
    `

    return NextResponse.json(roles)
  } catch (error) {
    console.error("Error fetching roles:", error)
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, permissions } = await request.json()

    // Create the role
    const [role] = await sql`
      INSERT INTO roles (name, description)
      VALUES (${name}, ${description})
      RETURNING id, name, description, created_at
    `

    // Assign permissions to the role
    if (permissions && permissions.length > 0) {
      for (const permissionName of permissions) {
        await sql`
          INSERT INTO role_permissions (role_id, permission_id)
          SELECT ${role.id}, p.id
          FROM permissions p
          WHERE p.name = ${permissionName}
          ON CONFLICT (role_id, permission_id) DO NOTHING
        `
      }
    }

    return NextResponse.json(role)
  } catch (error) {
    console.error("Error creating role:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}
