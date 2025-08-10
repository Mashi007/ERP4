import { xai } from '@ai-sdk/xai'
import { generateText, streamText } from 'ai'
import { sql, mockDeals, mockContacts, mockActivities } from './database'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'data' | 'chart'
  data?: any
}

export async function getCRMContext(): Promise<string> {
  try {
    let contacts: any[], deals: any[], activities: any[]

    if (sql && process.env.DATABASE_URL) {
      // Datos reales de la base de datos
      contacts = await sql`SELECT * FROM contacts LIMIT 10`
      deals = await sql`SELECT * FROM deals LIMIT 10`
      activities = await sql`SELECT * FROM activities LIMIT 10`
    } else {
      // Datos mock
      contacts = mockContacts.slice(0, 5)
      deals = mockDeals.slice(0, 5)
      activities = mockActivities.slice(0, 5)
    }

    const context = `
CONTEXTO DEL CRM:

CONTACTOS RECIENTES:
${contacts.map(c => `- ${c.name} (${c.company || 'Sin empresa'}) - Estado: ${c.status}`).join('\n')}

OPORTUNIDADES ACTIVAS:
${deals.map(d => `- ${d.title} (${d.company}) - $${d.value} - Etapa: ${d.stage}`).join('\n')}

ACTIVIDADES RECIENTES:
${activities.map(a => `- ${a.title} (${a.company || 'Sin empresa'}) - ${a.type} - ${a.status}`).join('\n')}

MÉTRICAS CLAVE:
- Total contactos: ${contacts.length}
- Total deals: ${deals.length}
- Valor total pipeline: $${deals.reduce((sum, d) => sum + Number(d.value), 0).toLocaleString()}
- Actividades pendientes: ${activities.filter(a => a.status === 'Programada').length}
    `

    return context
  } catch (error) {
    console.error('Error getting CRM context:', error)
    return 'Error al obtener contexto del CRM'
  }
}

export async function generateChatResponse(
  message: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const context = await getCRMContext()
    
    // Construir historial de conversación
    const history = conversationHistory
      .slice(-5) // Solo últimos 5 mensajes para no sobrecargar
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const systemPrompt = `
Eres un asistente de CRM inteligente especializado en ventas y gestión de relaciones con clientes. 

${context}

INSTRUCCIONES:
- Responde en español de manera profesional y útil
- Usa los datos del CRM para proporcionar insights específicos
- Sugiere acciones concretas cuando sea apropiado
- Si no tienes información suficiente, pregunta por más detalles
- Mantén las respuestas concisas pero informativas
- Puedes hacer análisis, sugerir estrategias, y responder preguntas sobre el pipeline

HISTORIAL DE CONVERSACIÓN:
${history}

PREGUNTA DEL USUARIO: ${message}
    `

    if (!process.env.XAI_API_KEY) {
      // Respuesta básica sin IA
      return generateBasicResponse(message, context)
    }

    const { text } = await generateText({
      model: xai('grok-beta'),
      prompt: systemPrompt,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error('Error generating chat response:', error)
    return 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.'
  }
}

function generateBasicResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('contacto') || lowerMessage.includes('cliente')) {
    return `Basado en tu CRM, tienes varios contactos activos. Los más recientes incluyen contactos en diferentes etapas del proceso de ventas. ¿Te gustaría que analice algún contacto específico?`
  }

  if (lowerMessage.includes('deal') || lowerMessage.includes('oportunidad') || lowerMessage.includes('venta')) {
    return `Tu pipeline actual muestra varias oportunidades en diferentes etapas. Hay deals en negociación que podrían requerir seguimiento prioritario. ¿Quieres que revise alguna oportunidad específica?`
  }

  if (lowerMessage.includes('actividad') || lowerMessage.includes('tarea') || lowerMessage.includes('seguimiento')) {
    return `Tienes actividades programadas que requieren atención. Te recomiendo revisar las actividades pendientes y priorizar las llamadas y reuniones programadas.`
  }

  if (lowerMessage.includes('reporte') || lowerMessage.includes('análisis') || lowerMessage.includes('métrica')) {
    return `Puedo ayudarte a analizar las métricas de tu CRM. Tu pipeline muestra un buen balance de oportunidades. ¿Te interesa un análisis específico de alguna métrica?`
  }

  if (lowerMessage.includes('hola') || lowerMessage.includes('ayuda') || lowerMessage.includes('qué puedes hacer')) {
    return `¡Hola! Soy tu asistente de CRM. Puedo ayudarte con:
    
• Análisis de contactos y oportunidades
• Sugerencias para el seguimiento de deals
• Revisión de actividades pendientes
• Insights sobre tu pipeline de ventas
• Recomendaciones estratégicas

¿En qué te gustaría que te ayude hoy?`
  }

  return `Entiendo tu consulta sobre "${message}". Basado en los datos de tu CRM, puedo ayudarte a analizar la información disponible. ¿Podrías ser más específico sobre qué aspecto te interesa más?`
}

export async function streamChatResponse(
  message: string,
  conversationHistory: ChatMessage[]
) {
  try {
    const context = await getCRMContext()
    
    const history = conversationHistory
      .slice(-5)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const systemPrompt = `
Eres un asistente de CRM inteligente especializado en ventas y gestión de relaciones con clientes.

${context}

INSTRUCCIONES:
- Responde en español de manera profesional y útil
- Usa los datos del CRM para proporcionar insights específicos
- Sugiere acciones concretas cuando sea apropiado
- Mantén las respuestas concisas pero informativas

HISTORIAL:
${history}

PREGUNTA: ${message}
    `

    if (!process.env.XAI_API_KEY) {
      // Simular streaming para respuesta básica
      const response = generateBasicResponse(message, context)
      return {
        textStream: async function* () {
          const words = response.split(' ')
          for (const word of words) {
            yield word + ' '
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }()
      }
    }

    return streamText({
      model: xai('grok-beta'),
      prompt: systemPrompt,
      maxTokens: 800,
    })
  } catch (error) {
    console.error('Error streaming chat response:', error)
    throw error
  }
}
