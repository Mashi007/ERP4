'use server'

import { revalidatePath } from 'next/cache'
import { getDataWithFallback, mockMarketingLists, mockMarketingCampaigns } from '@/lib/database'
import { generateMarketingCampaign, generateMarketingInsights } from '@/lib/ai-enhanced'
import type { MarketingList, MarketingCampaign } from '@/lib/database'
import { sql } from '@/lib/database'

export async function getMarketingLists(): Promise<MarketingList[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const lists = await sql`
        SELECT ml.*, 
               COUNT(mlc.contact_id) as contact_count
        FROM marketing_lists ml
        LEFT JOIN marketing_list_contacts mlc ON ml.id = mlc.list_id AND mlc.status = 'active'
        GROUP BY ml.id
        ORDER BY ml.created_at DESC
      `
      return lists as MarketingList[]
    },
    mockMarketingLists
  )
}

export async function getMarketingCampaigns(): Promise<MarketingCampaign[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const campaigns = await sql`
        SELECT mc.*, ml.name as list_name
        FROM marketing_campaigns mc
        LEFT JOIN marketing_lists ml ON mc.list_id = ml.id
        ORDER BY mc.created_at DESC
      `
      return campaigns as MarketingCampaign[]
    },
    mockMarketingCampaigns
  )
}

export async function createMarketingList(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)

  if (sql) {
    try {
      await sql`
        INSERT INTO marketing_lists (name, description, tags)
        VALUES (${name}, ${description}, ${tags})
      `
    } catch (error) {
      console.error('Error creating marketing list:', error)
      throw new Error('Failed to create marketing list')
    }
  }

  revalidatePath('/marketing')
  return { success: true }
}

export async function generateCampaignWithAI(prompt: string, audience: string) {
  const campaign = await generateMarketingCampaign(prompt, audience)
  return campaign
}

export async function createMarketingCampaign(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const subject = formData.get('subject') as string
  const content = formData.get('content') as string
  const listId = formData.get('listId') as string
  const scheduledAt = formData.get('scheduledAt') as string

  if (sql) {
    try {
      await sql`
        INSERT INTO marketing_campaigns (
          name, type, subject, content, list_id, 
          scheduled_at, status, created_by
        ) VALUES (
          ${name}, ${type}, ${subject}, ${content}, 
          ${listId ? parseInt(listId) : null}, 
          ${scheduledAt || null}, 
          ${scheduledAt ? 'scheduled' : 'draft'}, 
          'Daniel Casañas'
        )
      `
    } catch (error) {
      console.error('Error creating marketing campaign:', error)
      throw new Error('Failed to create marketing campaign')
    }
  }

  revalidatePath('/marketing')
  return { success: true }
}

export async function updateCampaignStatus(campaignId: number, status: string) {
  if (sql) {
    try {
      const updateData: any = { status, updated_at: new Date() }
      
      if (status === 'completed') {
        updateData.sent_at = new Date()
        // Simular métricas de ejemplo
        updateData.sent_count = Math.floor(Math.random() * 1000) + 500
        updateData.opened_count = Math.floor(updateData.sent_count * 0.35)
        updateData.clicked_count = Math.floor(updateData.opened_count * 0.15)
        updateData.open_rate = (updateData.opened_count / updateData.sent_count * 100).toFixed(1)
        updateData.click_rate = (updateData.clicked_count / updateData.sent_count * 100).toFixed(1)
      }

      await sql`
        UPDATE marketing_campaigns 
        SET status = ${status}, 
            sent_at = ${updateData.sent_at || null},
            sent_count = ${updateData.sent_count || 0},
            opened_count = ${updateData.opened_count || 0},
            clicked_count = ${updateData.clicked_count || 0},
            open_rate = ${updateData.open_rate || 0},
            click_rate = ${updateData.click_rate || 0},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `
    } catch (error) {
      console.error('Error updating campaign status:', error)
      throw new Error('Failed to update campaign status')
    }
  }

  revalidatePath('/marketing')
  return { success: true }
}

export async function generateMarketingReport() {
  const campaigns = await getMarketingCampaigns()
  const insights = await generateMarketingInsights(campaigns)
  return { insights }
}

export async function deleteCampaign(campaignId: number) {
  if (sql) {
    try {
      await sql`
        DELETE FROM marketing_campaigns 
        WHERE id = ${campaignId}
      `
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw new Error('Failed to delete campaign')
    }
  }

  revalidatePath('/marketing')
  return { success: true }
}
