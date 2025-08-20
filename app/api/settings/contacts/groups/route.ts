import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import ContactFieldsStorage from "@/lib/contact-fields-storage"

const sql = neon(process.env.DATABASE_URL!)

async function checkDatabaseTables() {
  try {
    await sql`SELECT 1 FROM contact_field_groups LIMIT 1`
    return true
  } catch (error) {
    return false
  }
}

export async function GET() {
  try {
    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const groups = storage.getGroups()

      return NextResponse.json(groups)
    }

    // Use database
    const groups = await sql`
      SELECT 
        cfg.*,
        COUNT(cf.id) as field_count
      FROM contact_field_groups cfg
      LEFT JOIN contact_fields cf ON cfg.group_name = cf.field_group
      GROUP BY cfg.id, cfg.group_name, cfg.group_label, cfg.group_description, 
               cfg.group_order, cfg.is_active, cfg.is_collapsible, cfg.created_at, cfg.updated_at
      ORDER BY cfg.group_order ASC
    `

    return NextResponse.json(groups)
  } catch (error) {
    console.error("Error fetching groups:", error)

    // Fallback to in-memory storage
    const storage = ContactFieldsStorage.getInstance()
    const groups = storage.getGroups()

    return NextResponse.json(groups)
  }
}

export async function POST(request: NextRequest) {
  try {
    const groupData = await request.json()
    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const newGroup = storage.createGroup({
        group_name: groupData.group_name,
        group_label: groupData.group_label,
        group_description: groupData.group_description,
        group_order: groupData.group_order || 0,
        is_active: true,
        is_collapsible: groupData.is_collapsible || false,
      })

      return NextResponse.json(newGroup)
    }

    // Use database
    const [newGroup] = await sql`
      INSERT INTO contact_field_groups (
        group_name, group_label, group_description, group_order, is_active, is_collapsible
      ) VALUES (
        ${groupData.group_name}, ${groupData.group_label}, ${groupData.group_description},
        ${groupData.group_order || 0}, ${true}, ${groupData.is_collapsible || false}
      )
      RETURNING *
    `

    return NextResponse.json(newGroup)
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Error creating group" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const groupData = await request.json()
    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const updatedGroup = storage.updateGroup(groupData.id, groupData)

      if (!updatedGroup) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 })
      }

      return NextResponse.json(updatedGroup)
    }

    // Use database
    const [updatedGroup] = await sql`
      UPDATE contact_field_groups 
      SET 
        group_label = COALESCE(${groupData.group_label}, group_label),
        group_description = COALESCE(${groupData.group_description}, group_description),
        group_order = COALESCE(${groupData.group_order}, group_order),
        is_active = COALESCE(${groupData.is_active}, is_active),
        is_collapsible = COALESCE(${groupData.is_collapsible}, is_collapsible),
        updated_at = NOW()
      WHERE id = ${groupData.id}
      RETURNING *
    `

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json(updatedGroup)
  } catch (error) {
    console.error("Error updating group:", error)
    return NextResponse.json({ error: "Error updating group" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 })
    }

    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()

      try {
        const deleted = storage.deleteGroup(id)

        if (!deleted) {
          return NextResponse.json({ error: "Group not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Error deleting group" },
          { status: 400 },
        )
      }
    }

    // Check if group has fields
    const fieldsInGroup = await sql`
      SELECT COUNT(*) as count FROM contact_fields WHERE field_group = (
        SELECT group_name FROM contact_field_groups WHERE id = ${id}
      )
    `

    if (fieldsInGroup[0]?.count > 0) {
      return NextResponse.json({ error: "No se puede eliminar un grupo que contiene campos" }, { status: 400 })
    }

    // Use database
    const [deletedGroup] = await sql`
      DELETE FROM contact_field_groups 
      WHERE id = ${id}
      RETURNING *
    `

    if (!deletedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting group:", error)
    return NextResponse.json({ error: "Error deleting group" }, { status: 500 })
  }
}
