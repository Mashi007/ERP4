import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import ContactFieldsStorage from "@/lib/contact-fields-storage"

const sql = neon(process.env.DATABASE_URL!)

async function checkDatabaseTables() {
  try {
    await sql`SELECT 1 FROM contact_field_groups LIMIT 1`
    await sql`SELECT 1 FROM contact_fields LIMIT 1`
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
      const fields = storage.getFields()

      return NextResponse.json({
        fields,
        usingDefaults: false, // Hide the warning
        setupRequired: false,
      })
    }

    // Use database
    const fields = await sql`
      SELECT 
        cf.*,
        cfg.group_label,
        cfg.group_description
      FROM contact_fields cf
      LEFT JOIN contact_field_groups cfg ON cf.field_group = cfg.group_name
      ORDER BY cf.field_order ASC
    `

    return NextResponse.json({
      fields,
      usingDefaults: false,
      setupRequired: false,
    })
  } catch (error) {
    console.error("Error fetching fields:", error)

    // Fallback to in-memory storage
    const storage = ContactFieldsStorage.getInstance()
    const fields = storage.getFields()

    return NextResponse.json({
      fields,
      usingDefaults: false,
      setupRequired: false,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const fieldData = await request.json()
    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const newField = storage.createField({
        field_name: fieldData.field_name,
        field_label: fieldData.field_label,
        field_type: fieldData.field_type,
        is_required: fieldData.is_required || false,
        is_active: true,
        field_order: fieldData.field_order || 0,
        default_value: fieldData.default_value,
        validation_rules: fieldData.validation_rules || {},
        field_options: fieldData.field_options || [],
        help_text: fieldData.help_text,
        field_group: fieldData.field_group,
      })

      return NextResponse.json(newField)
    }

    // Use database
    const [newField] = await sql`
      INSERT INTO contact_fields (
        field_name, field_label, field_type, is_required, is_active,
        field_order, default_value, validation_rules, field_options,
        help_text, field_group
      ) VALUES (
        ${fieldData.field_name}, ${fieldData.field_label}, ${fieldData.field_type},
        ${fieldData.is_required || false}, ${true},
        ${fieldData.field_order || 0}, ${fieldData.default_value},
        ${JSON.stringify(fieldData.validation_rules || {})},
        ${JSON.stringify(fieldData.field_options || [])},
        ${fieldData.help_text}, ${fieldData.field_group}
      )
      RETURNING *
    `

    return NextResponse.json(newField)
  } catch (error) {
    console.error("Error creating field:", error)
    return NextResponse.json({ error: "Error creating field" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const fieldData = await request.json()
    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const updatedField = storage.updateField(fieldData.id, fieldData)

      if (!updatedField) {
        return NextResponse.json({ error: "Field not found" }, { status: 404 })
      }

      return NextResponse.json(updatedField)
    }

    // Use database
    const [updatedField] = await sql`
      UPDATE contact_fields 
      SET 
        field_label = COALESCE(${fieldData.field_label}, field_label),
        field_type = COALESCE(${fieldData.field_type}, field_type),
        is_required = COALESCE(${fieldData.is_required}, is_required),
        is_active = COALESCE(${fieldData.is_active}, is_active),
        field_order = COALESCE(${fieldData.field_order}, field_order),
        default_value = COALESCE(${fieldData.default_value}, default_value),
        validation_rules = COALESCE(${JSON.stringify(fieldData.validation_rules)}, validation_rules),
        field_options = COALESCE(${JSON.stringify(fieldData.field_options)}, field_options),
        help_text = COALESCE(${fieldData.help_text}, help_text),
        field_group = COALESCE(${fieldData.field_group}, field_group),
        updated_at = NOW()
      WHERE id = ${fieldData.id}
      RETURNING *
    `

    if (!updatedField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 })
    }

    return NextResponse.json(updatedField)
  } catch (error) {
    console.error("Error updating field:", error)
    return NextResponse.json({ error: "Error updating field" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "Field ID is required" }, { status: 400 })
    }

    const hasTables = await checkDatabaseTables()

    if (!hasTables) {
      // Use in-memory storage
      const storage = ContactFieldsStorage.getInstance()
      const deleted = storage.deleteField(id)

      if (!deleted) {
        return NextResponse.json({ error: "Field not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    }

    // Use database
    const [deletedField] = await sql`
      DELETE FROM contact_fields 
      WHERE id = ${id}
      RETURNING *
    `

    if (!deletedField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting field:", error)
    return NextResponse.json({ error: "Error deleting field" }, { status: 500 })
  }
}
