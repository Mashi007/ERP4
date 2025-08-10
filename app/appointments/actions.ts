'use server'

import { revalidatePath } from 'next/cache'
import { getDataWithFallback, mockAppointments } from '@/lib/database'
import { generateAppointmentInsights } from '@/lib/ai-enhanced'
import type { Appointment } from '@/lib/database'
import { sql } from '@/lib/database'

export async function getAppointments(): Promise<Appointment[]> {
  console.log('🔄 [Server Action] getAppointments - Cargando citas...')
  
  return getDataWithFallback(
    async () => {
      if (!sql) {
        console.log('⚠️ [Server Action] Base de datos no configurada, usando citas mock')
        throw new Error('Database not configured')
      }
      
      console.log('🔍 [Server Action] Consultando citas desde BD...')
      const appointments = await sql`
        SELECT a.*, c.name as contact_name, c.company as contact_company
        FROM appointments a
        LEFT JOIN contacts c ON a.contact_id = c.id
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `
      
      console.log('✅ [Server Action] Citas cargadas desde BD:', appointments.length)
      return appointments as Appointment[]
    },
    mockAppointments
  )
}

export async function createAppointment(formData: FormData): Promise<Appointment> {
  const title = formData.get('title') as string
  const contactId = formData.get('contact_id') as string
  const company = formData.get('company') as string
  const appointment_date = formData.get('appointment_date') as string
  const appointment_time = formData.get('appointment_time') as string
  const duration = parseInt(formData.get('duration') as string) || 60
  const type = formData.get('type') as string || 'meeting'
  const location = formData.get('location') as string || null
  const notes = formData.get('notes') as string || null

  // Si no hay base de datos configurada, crear cita mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log('⚠️ [Server Action] Base de datos no configurada, creando cita mock')
    
    const newAppointment: Appointment = {
      id: Math.max(...mockAppointments.map(a => a.id)) + 1,
      title,
      contact_id: contactId ? parseInt(contactId) : null,
      deal_id: null,
      company,
      appointment_date,
      appointment_time,
      duration,
      type,
      location,
      status: 'scheduled',
      notes,
      sales_owner: 'Daniel Casañas',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Agregar al array de citas mock (simulación)
    mockAppointments.unshift(newAppointment)
    
    console.log('✅ [Server Action] Cita mock creada:', newAppointment.title)
    revalidatePath('/appointments')
    return newAppointment
  }

  try {
    console.log('🔄 [Server Action] Creando cita en base de datos...')
    const result = await sql`
      INSERT INTO appointments (
        title, contact_id, company, appointment_date, appointment_time, 
        duration, type, location, notes, sales_owner, status
      ) VALUES (
        ${title}, ${contactId ? parseInt(contactId) : null}, ${company}, 
        ${appointment_date}, ${appointment_time}, ${duration}, ${type}, 
        ${location}, ${notes}, 'Daniel Casañas', 'scheduled'
      )
      RETURNING *
    `
    
    console.log('✅ [Server Action] Cita creada en BD:', result[0].title)
    revalidatePath('/appointments')
    return result[0] as Appointment
  } catch (error) {
    console.error('❌ [Server Action] Error creando cita en BD:', error)
    
    // Fallback: crear cita mock si falla la BD
    console.log('🔄 [Server Action] Fallback: creando cita mock por error en BD')
    const newAppointment: Appointment = {
      id: Math.max(...mockAppointments.map(a => a.id)) + 1,
      title,
      contact_id: contactId ? parseInt(contactId) : null,
      deal_id: null,
      company,
      appointment_date,
      appointment_time,
      duration,
      type,
      location,
      status: 'scheduled',
      notes,
      sales_owner: 'Daniel Casañas',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockAppointments.unshift(newAppointment)
    revalidatePath('/appointments')
    return newAppointment
  }
}

export async function updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
  // Si no hay base de datos configurada, actualizar cita mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log('⚠️ [Server Action] Base de datos no configurada, actualizando cita mock')
    
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id)
    if (appointmentIndex === -1) {
      throw new Error('Appointment not found')
    }
    
    const updatedAppointment = {
      ...mockAppointments[appointmentIndex],
      ...data,
      updated_at: new Date().toISOString()
    }
    
    mockAppointments[appointmentIndex] = updatedAppointment
    
    console.log('✅ [Server Action] Cita mock actualizada:', updatedAppointment.title)
    revalidatePath('/appointments')
    return updatedAppointment
  }

  try {
    console.log('🔄 [Server Action] Actualizando cita en base de datos...')
    const result = await sql`
      UPDATE appointments 
      SET 
        title = COALESCE(${data.title}, title),
        contact_id = COALESCE(${data.contact_id}, contact_id),
        company = COALESCE(${data.company}, company),
        appointment_date = COALESCE(${data.appointment_date}, appointment_date),
        appointment_time = COALESCE(${data.appointment_time}, appointment_time),
        duration = COALESCE(${data.duration}, duration),
        type = COALESCE(${data.type}, type),
        location = COALESCE(${data.location}, location),
        status = COALESCE(${data.status}, status),
        notes = COALESCE(${data.notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    console.log('✅ [Server Action] Cita actualizada en BD:', result[0].title)
    revalidatePath('/appointments')
    return result[0] as Appointment
  } catch (error) {
    console.error('❌ [Server Action] Error actualizando cita en BD:', error)
    throw new Error('Failed to update appointment')
  }
}

export async function deleteAppointment(id: number): Promise<void> {
  // Si no hay base de datos configurada, eliminar cita mock
  if (!sql || !process.env.DATABASE_URL) {
    console.log('⚠️ [Server Action] Base de datos no configurada, eliminando cita mock')
    
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id)
    if (appointmentIndex === -1) {
      throw new Error('Appointment not found')
    }
    
    const deletedAppointment = mockAppointments[appointmentIndex]
    mockAppointments.splice(appointmentIndex, 1)
    
    console.log('✅ [Server Action] Cita mock eliminada:', deletedAppointment.title)
    revalidatePath('/appointments')
    return
  }

  try {
    console.log('🔄 [Server Action] Eliminando cita de base de datos...')
    await sql`DELETE FROM appointments WHERE id = ${id}`
    
    console.log('✅ [Server Action] Cita eliminada de BD')
    revalidatePath('/appointments')
  } catch (error) {
    console.error('❌ [Server Action] Error eliminando cita de BD:', error)
    throw new Error('Failed to delete appointment')
  }
}
