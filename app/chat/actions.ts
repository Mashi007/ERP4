'use server'

import { generateChatResponse, streamChatResponse } from '@/lib/chat-ai'
import type { ChatMessage } from '@/lib/chat-ai'

export async function sendChatMessage(message: string, history: ChatMessage[]) {
  try {
    const response = await generateChatResponse(message, history)
    return { success: true, response }
  } catch (error) {
    console.error('Error in chat action:', error)
    return { 
      success: false, 
      error: 'Error al procesar el mensaje. Por favor, intenta de nuevo.' 
    }
  }
}

export async function streamChatMessage(message: string, history: ChatMessage[]) {
  try {
    const stream = await streamChatResponse(message, history)
    return { success: true, stream }
  } catch (error) {
    console.error('Error in streaming chat:', error)
    return { 
      success: false, 
      error: 'Error al procesar el mensaje en streaming.' 
    }
  }
}
