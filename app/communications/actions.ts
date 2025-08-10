'use server'

import { revalidatePath } from 'next/cache'
import { getDataWithFallback, mockConversations } from '@/lib/database'
import { generateCommunicationStrategy } from '@/lib/ai-enhanced'
import type { Conversation, Message, CommunicationSetting } from '@/lib/database'
import { sql } from '@/lib/database'

export async function getConversations(): Promise<Conversation[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const conversations = await sql`
        SELECT c.*, 
               contacts.name as contact_name,
               contacts.company as contact_company,
               contacts.avatar_url as contact_avatar
        FROM conversations c
        LEFT JOIN contacts ON c.contact_id = contacts.id
        ORDER BY c.last_message_at DESC
      `
      return conversations as Conversation[]
    },
    mockConversations
  )
}

export async function getMessages(conversationId: number): Promise<Message[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const messages = await sql`
        SELECT * FROM messages 
        WHERE conversation_id = ${conversationId}
        ORDER BY sent_at ASC
      `
      return messages as Message[]
    },
    [
      {
        id: 1,
        conversation_id: conversationId,
        sender_type: 'contact',
        sender_name: 'Cliente',
        sender_email: 'cliente@empresa.com',
        content: 'Hola, me interesa conocer más sobre sus servicios.',
        message_type: 'text',
        is_read: true,
        has_attachment: false,
        sent_at: '2024-01-15T10:00:00Z',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        conversation_id: conversationId,
        sender_type: 'user',
        sender_name: 'Daniel Casañas',
        sender_email: 'daniel@empresa.com',
        content: 'Gracias por su interés. Estaré encantado de ayudarle. ¿Podría contarme más sobre sus necesidades específicas?',
        message_type: 'text',
        is_read: true,
        has_attachment: false,
        sent_at: '2024-01-15T10:15:00Z',
        created_at: '2024-01-15T10:15:00Z'
      }
    ]
  )
}

export async function getCommunicationSettings(): Promise<CommunicationSetting[]> {
  return getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const settings = await sql`
        SELECT * FROM communication_settings 
        WHERE user_id = 'daniel_casanas'
        ORDER BY is_favorite DESC, provider_type ASC
      `
      return settings as CommunicationSetting[]
    },
    [
      {
        id: 1,
        user_id: 'daniel_casanas',
        provider_type: 'email',
        provider_name: 'Gmail',
        is_connected: true,
        is_favorite: true,
        account_email: 'daniel@empresa.com',
        settings: { smtp_server: 'smtp.gmail.com', port: 587, use_tls: true },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        user_id: 'daniel_casanas',
        provider_type: 'sms',
        provider_name: 'Twilio',
        is_connected: true,
        is_favorite: false,
        account_email: null,
        settings: { account_sid: 'AC***', phone_number: '+1234567890' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
  )
}

export async function createConversation(formData: FormData) {
  const contactId = formData.get('contactId') as string
  const subject = formData.get('subject') as string

  if (sql) {
    try {
      const result = await sql`
        INSERT INTO conversations (contact_id, subject, status)
        VALUES (${parseInt(contactId)}, ${subject}, 'active')
        RETURNING id
      `
      return { success: true, conversationId: result[0].id }
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw new Error('Failed to create conversation')
    }
  }

  revalidatePath('/communications')
  return { success: true, conversationId: Math.floor(Math.random() * 1000) }
}

export async function sendMessage(formData: FormData) {
  const conversationId = parseInt(formData.get('conversationId') as string)
  const content = formData.get('content') as string
  const senderType = formData.get('senderType') as string || 'user'

  if (sql) {
    try {
      await sql`
        INSERT INTO messages (
          conversation_id, sender_type, sender_name, sender_email, 
          content, message_type, is_read
        ) VALUES (
          ${conversationId}, ${senderType}, 'Daniel Casañas', 
          'daniel@empresa.com', ${content}, 'text', true
        )
      `

      // Actualizar última actividad de la conversación
      await sql`
        UPDATE conversations 
        SET last_message_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${conversationId}
      `
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message')
    }
  }

  revalidatePath('/communications')
  return { success: true }
}

export async function generateContactStrategy(contactId: number) {
  // Obtener información del contacto
  const contacts = await getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      const result = await sql`
        SELECT * FROM contacts WHERE id = ${contactId}
      `
      return result
    },
    []
  )

  const contact = contacts[0]
  if (!contact) {
    throw new Error('Contact not found')
  }

  const strategy = await generateCommunicationStrategy({
    name: contact.name,
    company: contact.company || '',
    status: contact.status,
    lastInteraction: contact.updated_at
  })

  return { strategy }
}

export async function updateCommunicationSetting(formData: FormData) {
  const settingId = parseInt(formData.get('settingId') as string)
  const isConnected = formData.get('isConnected') === 'true'
  const isFavorite = formData.get('isFavorite') === 'true'

  if (sql) {
    try {
      await sql`
        UPDATE communication_settings 
        SET is_connected = ${isConnected}, 
            is_favorite = ${isFavorite},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${settingId}
      `
    } catch (error) {
      console.error('Error updating communication setting:', error)
      throw new Error('Failed to update communication setting')
    }
  }

  revalidatePath('/communications')
  return { success: true }
}
