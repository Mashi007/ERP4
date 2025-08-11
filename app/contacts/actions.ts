"use server"

import { sql } from "@/lib/database"
import type { Contact } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { getDataWithFallback, mockContacts } from "@/lib/database"
import { ensureContactsNifColumn } from "@/lib/schema-ensure"

export async function getContacts(): Promise<Contact[]> {
  console.log("🔄 [Server Action] getContacts - Cargando contactos para selector de citas...")

  return getDataWithFallback(async () => {
    if (!sql) {
      console.log("⚠️ [Server Action] Base de datos no configurada, usando contactos mock")
      throw new Error("Database not configured")
    }

    console.log("🔍 [Server Action] Consultando contactos desde BD...")
    const contacts = await sql`
        SELECT * FROM contacts 
        ORDER BY name ASC
      `

    console.log("✅ [Server Action] Contactos cargados desde BD:", contacts.length)
    return contacts as Contact[]
  }, mockContacts)
}

export async function createContact(formData: FormData): Promise<Contact> {
  const name = formData.get("name") as string
  const company = (formData.get("company") as string) || null
  const job_title = (formData.get("job_title") as string) || null
  const email = (formData.get("email") as string) || null
  const phone = (formData.get("phone") as string) || null
  const status = (formData.get("status") as string) || "New"
  const nif = (formData.get("nif") as string) || null

  // Si no hay base de datos configurada, crear contacto mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log("⚠️ [Server Action] Base de datos no configurada, creando contacto mock")

    const newContact: Contact = {
      id: Math.max(0, ...mockContacts.map((c) => c.id)) + 1,
      name,
      company,
      job_title,
      email,
      phone,
      status,
      nif,
      tags: [],
      sales_owner: "Daniel Casañas",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockContacts.unshift(newContact)

    console.log("✅ [Server Action] Contacto mock creado:", newContact.name)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return newContact
  }

  try {
    // Ensure nif column exists, fall back if not possible
    const nifReady = await ensureContactsNifColumn()

    console.log("🔄 [Server Action] Creando contacto en base de datos...")
    const result = nifReady
      ? await sql`
          INSERT INTO contacts (name, company, job_title, email, phone, status, nif, sales_owner)
          VALUES (${name}, ${company}, ${job_title}, ${email}, ${phone}, ${status}, ${nif}, 'Daniel Casañas')
          RETURNING *
        `
      : await sql`
          INSERT INTO contacts (name, company, job_title, email, phone, status, sales_owner)
          VALUES (${name}, ${company}, ${job_title}, ${email}, ${phone}, ${status}, 'Daniel Casañas')
          RETURNING *
        `

    console.log("✅ [Server Action] Contacto creado en BD:", result[0].name)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return result[0] as Contact
  } catch (error) {
    console.error("❌ [Server Action] Error creando contacto en BD:", error)

    // Fallback: crear contacto mock si falla la BD
    console.log("🔄 [Server Action] Fallback: creando contacto mock por error en BD")
    const newContact: Contact = {
      id: Math.max(0, ...mockContacts.map((c) => c.id)) + 1,
      name,
      company,
      job_title,
      email,
      phone,
      status,
      nif,
      tags: [],
      sales_owner: "Daniel Casañas",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockContacts.unshift(newContact)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return newContact
  }
}

export async function updateContact(id: number, data: Partial<Contact>): Promise<Contact> {
  // Si no hay base de datos configurada, actualizar contacto mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log("⚠️ [Server Action] Base de datos no configurada, actualizando contacto mock")

    const contactIndex = mockContacts.findIndex((c) => c.id === id)
    if (contactIndex === -1) {
      throw new Error("Contact not found")
    }

    const updatedContact: Contact = {
      ...mockContacts[contactIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    mockContacts[contactIndex] = updatedContact

    console.log("✅ [Server Action] Contacto mock actualizado:", updatedContact.name)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return updatedContact
  }

  try {
    // Ensure nif column exists, fall back if not possible
    const nifReady = await ensureContactsNifColumn()

    console.log("🔄 [Server Action] Actualizando contacto en base de datos...")
    const result = nifReady
      ? await sql`
          UPDATE contacts 
          SET 
            name = COALESCE(${data.name}, name),
            company = COALESCE(${data.company}, company),
            job_title = COALESCE(${data.job_title}, job_title),
            email = COALESCE(${data.email}, email),
            phone = COALESCE(${data.phone}, phone),
            status = COALESCE(${data.status}, status),
            nif = COALESCE(${(data as any).nif ?? null}, nif),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `
      : await sql`
          UPDATE contacts 
          SET 
            name = COALESCE(${data.name}, name),
            company = COALESCE(${data.company}, company),
            job_title = COALESCE(${data.job_title}, job_title),
            email = COALESCE(${data.email}, email),
            phone = COALESCE(${data.phone}, phone),
            status = COALESCE(${data.status}, status),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `

    console.log("✅ [Server Action] Contacto actualizado en BD:", result[0].name)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return result[0] as Contact
  } catch (error) {
    console.error("❌ [Server Action] Error actualizando contacto en BD:", error)
    throw new Error("Failed to update contact")
  }
}

export async function deleteContact(id: number): Promise<void> {
  // Si no hay base de datos configurada, eliminar contacto mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log("⚠️ [Server Action] Base de datos no configurada, eliminando contacto mock")

    const contactIndex = mockContacts.findIndex((c) => c.id === id)
    if (contactIndex === -1) {
      throw new Error("Contact not found")
    }

    const deletedContact = mockContacts[contactIndex]
    mockContacts.splice(contactIndex, 1)

    console.log("✅ [Server Action] Contacto mock eliminado:", deletedContact.name)
    revalidatePath("/contacts")
    revalidatePath("/appointments")
    return
  }

  try {
    console.log("🔄 [Server Action] Eliminando contacto de base de datos...")
    await sql`DELETE FROM contacts WHERE id = ${id}`

    console.log("✅ [Server Action] Contacto eliminado de BD")
    revalidatePath("/contacts")
    revalidatePath("/appointments")
  } catch (error) {
    console.error("❌ [Server Action] Error eliminando contacto de BD:", error)
    throw new Error("Failed to delete contact")
  }
}
