"use server"

import { sql, mockContacts, mockDeals, type Contact, type Deal } from "@/lib/database"
import { revalidatePath } from "next/cache"

interface OpportunityData {
  // Datos de la Oportunidad
  title: string
  value: string
  stage: string
  probability: string
  expected_close_date: string
  notes: string

  // Datos del Contacto
  contact_name: string
  contact_email: string
  contact_phone: string
  company: string
  job_title: string
  contact_notes: string

  // Datos Adicionales
  lead_source: string
  industry: string
  company_size: string
  budget_range: string
  decision_timeline: string
  pain_points: string
  competitors: string
  next_steps: string
}

interface UpdateOpportunityData {
  id: number
  title: string
  company: string
  value: number
  stage: string
  probability: number
  expected_close_date: string | null
  notes: string | null
  lead_source?: string
  industry?: string
  company_size?: string
  budget_range?: string
  decision_timeline?: string
  pain_points?: string
  competitors?: string
  next_steps?: string
}

export async function createOpportunityWithContact(data: OpportunityData) {
  try {
    // Verificar si el contacto ya existe por email
    let existingContact: Contact | null = null

    if (sql) {
      const contactResult = await sql`
        SELECT * FROM contacts WHERE email = ${data.contact_email} LIMIT 1
      `
      existingContact = (contactResult[0] as Contact) || null
    } else {
      // Buscar en datos mock
      existingContact = mockContacts.find((c) => c.email === data.contact_email) || null
    }

    let contact: Contact
    let contactCreated = false

    if (existingContact) {
      // Actualizar contacto existente con nueva información si está disponible
      if (sql) {
        const updateResult = await sql`
          UPDATE contacts 
          SET 
            name = COALESCE(NULLIF(${data.contact_name}, ''), name),
            company = COALESCE(NULLIF(${data.company}, ''), company),
            job_title = COALESCE(NULLIF(${data.job_title}, ''), job_title),
            phone = COALESCE(NULLIF(${data.contact_phone}, ''), phone),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existingContact.id}
          RETURNING *
        `
        contact = updateResult[0] as Contact
      } else {
        contact = existingContact
      }
    } else {
      // Crear nuevo contacto
      contactCreated = true

      if (sql) {
        const contactResult = await sql`
          INSERT INTO contacts (
            name, email, phone, company, job_title, status, 
            tags, sales_owner, avatar_url
          )
          VALUES (
            ${data.contact_name}, 
            ${data.contact_email}, 
            ${data.contact_phone || null}, 
            ${data.company}, 
            ${data.job_title || null}, 
            'New',
            ARRAY[]::text[],
            'Daniel Casañas',
            null
          )
          RETURNING *
        `
        contact = contactResult[0] as Contact
      } else {
        // Crear contacto mock
        contact = {
          id: Math.max(...mockContacts.map((c) => c.id)) + 1,
          name: data.contact_name,
          email: data.contact_email,
          phone: data.contact_phone || null,
          company: data.company,
          job_title: data.job_title || null,
          status: "New",
          tags: [],
          sales_owner: "Daniel Casañas",
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        mockContacts.push(contact)
      }
    }

    // Crear la oportunidad
    let deal: Deal

    if (sql) {
      const dealResult = await sql`
        INSERT INTO deals (
          title, company, contact_id, value, stage, probability,
          expected_close_date, notes, sales_owner,
          lead_source, industry, company_size, budget_range,
          decision_timeline, pain_points, competitors, next_steps
        )
        VALUES (
          ${data.title},
          ${data.company},
          ${contact.id},
          ${Number.parseFloat(data.value)},
          ${data.stage},
          ${Number.parseInt(data.probability)},
          ${data.expected_close_date || null},
          ${data.notes || null},
          'Daniel Casañas',
          ${data.lead_source || null},
          ${data.industry || null},
          ${data.company_size || null},
          ${data.budget_range || null},
          ${data.decision_timeline || null},
          ${data.pain_points || null},
          ${data.competitors || null},
          ${data.next_steps || null}
        )
        RETURNING *
      `
      deal = dealResult[0] as Deal
    } else {
      // Crear deal mock
      deal = {
        id: Math.max(...mockDeals.map((d) => d.id)) + 1,
        title: data.title,
        company: data.company,
        contact_id: contact.id,
        value: Number.parseFloat(data.value),
        stage: data.stage,
        probability: Number.parseInt(data.probability),
        expected_close_date: data.expected_close_date || null,
        notes: data.notes || null,
        sales_owner: "Daniel Casañas",
        lead_source: data.lead_source || null,
        industry: data.industry || null,
        company_size: data.company_size || null,
        budget_range: data.budget_range || null,
        decision_timeline: data.decision_timeline || null,
        pain_points: data.pain_points || null,
        competitors: data.competitors || null,
        next_steps: data.next_steps || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockDeals.push(deal)
    }

    // Crear actividad automática
    if (sql) {
      await sql`
        INSERT INTO activities (
          type, title, contact_id, deal_id, company,
          activity_date, status, notes, sales_owner
        )
        VALUES (
          'opportunity_created',
          ${"Nueva oportunidad: " + data.title},
          ${contact.id},
          ${deal.id},
          ${data.company},
          ${new Date().toISOString().split("T")[0]},
          'Completada',
          ${"Oportunidad creada desde Embudo de Ventas. " + (contactCreated ? "Nuevo contacto creado." : "Contacto existente vinculado.")},
          'Daniel Casañas'
        )
      `
    }

    // Revalidar páginas relacionadas
    revalidatePath("/pipeline")
    revalidatePath("/deals")
    revalidatePath("/contacts")
    revalidatePath("/dashboard")
    revalidatePath("/activities")

    return {
      success: true,
      deal,
      contact,
      contactCreated,
    }
  } catch (error) {
    console.error("Error creating opportunity with contact:", error)
    return {
      success: false,
      error: "Error al crear la oportunidad y contacto",
    }
  }
}

export async function updateOpportunity(dealId: number, data: UpdateOpportunityData) {
  try {
    let deal: Deal

    if (sql) {
      const result = await sql`
        UPDATE deals 
        SET 
          title = ${data.title},
          company = ${data.company},
          value = ${data.value},
          stage = ${data.stage},
          probability = ${data.probability},
          expected_close_date = ${data.expected_close_date},
          notes = ${data.notes},
          lead_source = ${data.lead_source || null},
          industry = ${data.industry || null},
          company_size = ${data.company_size || null},
          budget_range = ${data.budget_range || null},
          decision_timeline = ${data.decision_timeline || null},
          pain_points = ${data.pain_points || null},
          competitors = ${data.competitors || null},
          next_steps = ${data.next_steps || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${dealId}
        RETURNING *
      `
      deal = result[0] as Deal

      // Crear actividad automática para la actualización
      await sql`
        INSERT INTO activities (
          type, title, deal_id, activity_date, status, notes, sales_owner
        )
        VALUES (
          'opportunity_updated',
          ${"Oportunidad actualizada: " + data.title},
          ${dealId},
          ${new Date().toISOString().split("T")[0]},
          'Completada',
          ${"La oportunidad fue actualizada desde el Embudo de Ventas"},
          'Daniel Casañas'
        )
      `
    } else {
      // Actualizar en datos mock
      const dealIndex = mockDeals.findIndex((d) => d.id === dealId)
      if (dealIndex !== -1) {
        mockDeals[dealIndex] = {
          ...mockDeals[dealIndex],
          title: data.title,
          company: data.company,
          value: data.value,
          stage: data.stage,
          probability: data.probability,
          expected_close_date: data.expected_close_date,
          notes: data.notes,
          lead_source: data.lead_source,
          industry: data.industry,
          company_size: data.company_size,
          budget_range: data.budget_range,
          decision_timeline: data.decision_timeline,
          pain_points: data.pain_points,
          competitors: data.competitors,
          next_steps: data.next_steps,
          updated_at: new Date().toISOString(),
        }
        deal = mockDeals[dealIndex]
      } else {
        throw new Error("Deal not found")
      }
    }

    // Revalidar páginas relacionadas
    revalidatePath("/pipeline")
    revalidatePath("/deals")
    revalidatePath("/dashboard")
    revalidatePath("/activities")

    return { success: true, deal }
  } catch (error) {
    console.error("Error updating opportunity:", error)
    return { success: false, error: "Error al actualizar la oportunidad" }
  }
}

export async function deleteOpportunity(dealId: number) {
  try {
    if (sql) {
      // Obtener información del deal antes de eliminarlo
      const dealInfo = await sql`
        SELECT title FROM deals WHERE id = ${dealId}
      `

      if (dealInfo.length === 0) {
        return { success: false, error: "Oportunidad no encontrada" }
      }

      // Eliminar el deal
      await sql`
        DELETE FROM deals WHERE id = ${dealId}
      `

      // Crear actividad automática
      await sql`
        INSERT INTO activities (
          type, title, activity_date, status, notes, sales_owner
        )
        VALUES (
          'opportunity_deleted',
          ${"Oportunidad eliminada: " + dealInfo[0].title},
          ${new Date().toISOString().split("T")[0]},
          'Completada',
          'La oportunidad fue eliminada desde el Embudo de Ventas',
          'Daniel Casañas'
        )
      `
    } else {
      // Eliminar de datos mock
      const dealIndex = mockDeals.findIndex((d) => d.id === dealId)
      if (dealIndex !== -1) {
        mockDeals.splice(dealIndex, 1)
      } else {
        return { success: false, error: "Oportunidad no encontrada" }
      }
    }

    // Revalidar páginas relacionadas
    revalidatePath("/pipeline")
    revalidatePath("/deals")
    revalidatePath("/dashboard")
    revalidatePath("/activities")

    return { success: true }
  } catch (error) {
    console.error("Error deleting opportunity:", error)
    return { success: false, error: "Error al eliminar la oportunidad" }
  }
}

export async function updateDealStage(dealId: number, newStage: string) {
  try {
    if (sql) {
      const result = await sql`
        UPDATE deals 
        SET 
          stage = ${newStage},
          probability = CASE 
            WHEN ${newStage} = 'Ganado' THEN 100
            WHEN ${newStage} = 'Perdido' THEN 0
            WHEN ${newStage} = 'Cierre' THEN 90
            WHEN ${newStage} = 'Negociación' THEN 75
            WHEN ${newStage} = 'Propuesta' THEN 50
            WHEN ${newStage} = 'Calificación' THEN 25
            ELSE probability
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${dealId}
        RETURNING *
      `

      // Crear actividad automática para el cambio de etapa
      await sql`
        INSERT INTO activities (
          type, title, deal_id, activity_date, status, notes, sales_owner
        )
        VALUES (
          'stage_change',
          ${"Cambio de etapa a: " + newStage},
          ${dealId},
          ${new Date().toISOString().split("T")[0]},
          'Completada',
          ${"La oportunidad cambió automáticamente a la etapa: " + newStage},
          'Daniel Casañas'
        )
      `

      revalidatePath("/pipeline")
      revalidatePath("/deals")
      revalidatePath("/dashboard")
      revalidatePath("/activities")

      return { success: true, deal: result[0] }
    } else {
      // Actualizar en datos mock
      const dealIndex = mockDeals.findIndex((d) => d.id === dealId)
      if (dealIndex !== -1) {
        mockDeals[dealIndex].stage = newStage
        mockDeals[dealIndex].updated_at = new Date().toISOString()

        // Actualizar probabilidad basada en la etapa
        switch (newStage) {
          case "Ganado":
            mockDeals[dealIndex].probability = 100
            break
          case "Perdido":
            mockDeals[dealIndex].probability = 0
            break
          case "Cierre":
            mockDeals[dealIndex].probability = 90
            break
          case "Negociación":
            mockDeals[dealIndex].probability = 75
            break
          case "Propuesta":
            mockDeals[dealIndex].probability = 50
            break
          case "Calificación":
            mockDeals[dealIndex].probability = 25
            break
        }

        return { success: true, deal: mockDeals[dealIndex] }
      }
    }

    return { success: false, error: "Deal not found" }
  } catch (error) {
    console.error("Error updating deal stage:", error)
    return { success: false, error: "Error al actualizar la etapa" }
  }
}
