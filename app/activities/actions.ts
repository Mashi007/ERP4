'use server'

import { revalidatePath } from 'next/cache'
import { getDataWithFallback, mockActivities } from '@/lib/database'
import { generateActivityRecommendations } from '@/lib/ai-enhanced'
import type { Activity } from '@/lib/database'
import { sql } from '@/lib/database'

export async function getActivities(): Promise<Activity[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const activities = await sql`
        SELECT a.*, c.name as contact_name, c.company as contact_company
        FROM activities a
        LEFT JOIN contacts c ON a.contact_id = c.id
        ORDER BY a.activity_date DESC, a.activity_time DESC
      `
      return activities as Activity[]
    },
    mockActivities
  )
}

export async function createActivity(formData: FormData) {
  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const contactId = formData.get('contactId') as string
  const dealId = formData.get('dealId') as string
  const company = formData.get('company') as string
  const activityDate = formData.get('activityDate') as string
  const activityTime = formData.get('activityTime') as string
  const duration = parseInt(formData.get('duration') as string)
  const notes = formData.get('notes') as string

  if (sql) {
    try {
      await sql`
        INSERT INTO activities (
          type, title, contact_id, deal_id, company, 
          activity_date, activity_time, duration, notes, 
          status, sales_owner
        ) VALUES (
          ${type}, ${title}, 
          ${contactId ? parseInt(contactId) : null}, 
          ${dealId ? parseInt(dealId) : null}, 
          ${company}, ${activityDate}, ${activityTime}, 
          ${duration}, ${notes}, 'Programada', 'Daniel Casañas'
        )
      `
    } catch (error) {
      console.error('Error creating activity:', error)
      throw new Error('Failed to create activity')
    }
  }

  revalidatePath('/activities')
  return { success: true }
}

export async function updateActivityStatus(activityId: number, status: string) {
  if (sql) {
    try {
      await sql`
        UPDATE activities 
        SET status = ${status}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${activityId}
      `
    } catch (error) {
      console.error('Error updating activity status:', error)
      throw new Error('Failed to update activity status')
    }
  }

  revalidatePath('/activities')
  return { success: true }
}

export async function generateActivityInsights() {
  const activities = await getActivities()
  const recommendations = await generateActivityRecommendations(activities)
  return { recommendations }
}

export async function deleteActivity(activityId: number) {
  if (sql) {
    try {
      await sql`
        DELETE FROM activities 
        WHERE id = ${activityId}
      `
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw new Error('Failed to delete activity')
    }
  }

  revalidatePath('/activities')
  return { success: true }
}
