import { xai } from '@ai-sdk/xai'
import { generateText } from 'ai'

// Verificar si xAI está configurado
const isAIAvailable = !!process.env.XAI_API_KEY

// Función helper para generar respuestas con fallback
async function generateWithFallback(prompt: string, fallbackResponse: string): Promise<string> {
  if (!isAIAvailable) {
    return fallbackResponse
  }

  try {
    const { text } = await generateText({
      model: xai('grok-3'),
      prompt,
      maxTokens: 1000,
    })
    return text
  } catch (error) {
    console.error('AI generation failed:', error)
    return fallbackResponse
  }
}

// IA para Dashboard
export async function generateDashboardInsights(data: {
  totalContacts: number
  totalDeals: number
  totalRevenue: number
  activitiesCount: number
  appointmentsCount: number
  campaignsCount: number
}): Promise<string> {
  const prompt = `
    Analiza los siguientes datos del CRM y proporciona insights estratégicos:
    
    - Total de contactos: ${data.totalContacts}
    - Total de oportunidades: ${data.totalDeals}
    - Ingresos totales: $${data.totalRevenue}
    - Actividades registradas: ${data.activitiesCount}
    - Citas programadas: ${data.appointmentsCount}
    - Campañas de marketing: ${data.campaignsCount}
    
    Proporciona un análisis ejecutivo con:
    1. Estado general del negocio
    2. Fortalezas identificadas
    3. Áreas de mejora
    4. Recomendaciones estratégicas
    
    Responde en español de forma profesional y concisa.
  `

  const fallback = `
    ## 📊 Análisis Ejecutivo del CRM

    **Estado General:** El negocio muestra una actividad sólida con ${data.totalContacts} contactos activos y ${data.totalDeals} oportunidades en el pipeline, generando $${data.totalRevenue} en ingresos potenciales.

    **Fortalezas:**
    • Base de contactos robusta con ${data.totalContacts} registros
    • Pipeline activo con múltiples oportunidades
    • Actividad comercial constante (${data.activitiesCount} actividades)

    **Áreas de Mejora:**
    • Optimizar la conversión de contactos a oportunidades
    • Incrementar la frecuencia de seguimiento
    • Mejorar la segmentación de campañas

    **Recomendaciones:**
    1. Implementar scoring de leads para priorizar contactos
    2. Automatizar secuencias de seguimiento
    3. Crear campañas segmentadas por industria
    4. Establecer KPIs de conversión por etapa
  `

  return generateWithFallback(prompt, fallback)
}

// IA para Citas
export async function generateAppointmentInsights(appointment: {
  title: string
  company: string
  contactName?: string
  dealValue?: number
  notes?: string
}): Promise<string> {
  const prompt = `
    Analiza la siguiente cita y proporciona insights para maximizar su efectividad:
    
    Cita: ${appointment.title}
    Empresa: ${appointment.company}
    ${appointment.contactName ? `Contacto: ${appointment.contactName}` : ''}
    ${appointment.dealValue ? `Valor del deal: $${appointment.dealValue}` : ''}
    ${appointment.notes ? `Notas: ${appointment.notes}` : ''}
    
    Proporciona:
    1. Contexto y preparación recomendada
    2. Objetivos clave para la reunión
    3. Preguntas estratégicas a realizar
    4. Próximos pasos sugeridos
    
    Responde en español de forma práctica y accionable.
  `

  const fallback = `
    ## 🎯 Preparación para: ${appointment.title}

    **Contexto:** Reunión estratégica con ${appointment.company} para avanzar en la relación comercial y cerrar oportunidades pendientes.

    **Objetivos Clave:**
    • Entender necesidades específicas del cliente
    • Presentar soluciones alineadas con sus objetivos
    • Definir timeline y próximos pasos
    • Identificar decisores y proceso de compra

    **Preguntas Estratégicas:**
    1. ¿Cuáles son sus principales desafíos actuales?
    2. ¿Qué criterios utilizan para evaluar proveedores?
    3. ¿Cuál es su timeline para implementar una solución?
    4. ¿Quién más está involucrado en la decisión?

    **Próximos Pasos:**
    • Enviar resumen de la reunión en 24 horas
    • Proporcionar propuesta personalizada
    • Programar demo técnica si es necesario
    • Definir fecha para seguimiento
  `

  return generateWithFallback(prompt, fallback)
}

// IA para Marketing
export async function generateMarketingCampaign(prompt: string, audience: string): Promise<{
  subject: string
  content: string
  recommendations: string
}> {
  const aiPrompt = `
    Crea una campaña de email marketing basada en:
    
    Prompt del usuario: ${prompt}
    Audiencia objetivo: ${audience}
    
    Genera:
    1. Subject line atractivo (máximo 50 caracteres)
    2. Contenido del email (HTML simple, máximo 300 palabras)
    3. Recomendaciones de optimización
    
    Responde en español, tono profesional pero cercano.
  `

  const fallback = {
    subject: "🚀 Oferta Especial - No te la Pierdas",
    content: `
      <h2>¡Hola!</h2>
      <p>Tenemos una oferta especial diseñada especialmente para ti.</p>
      <p>Como cliente valorado, queremos ofrecerte acceso exclusivo a nuestros mejores productos y servicios con descuentos únicos.</p>
      <p><strong>Beneficios incluidos:</strong></p>
      <ul>
        <li>Descuento del 20% en todos los productos</li>
        <li>Envío gratuito en tu próxima compra</li>
        <li>Soporte prioritario por 3 meses</li>
      </ul>
      <p>Esta oferta es válida por tiempo limitado.</p>
      <p><a href="#" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Aprovechar Oferta</a></p>
      <p>¡Gracias por confiar en nosotros!</p>
    `,
    recommendations: `
      • Personalizar el saludo con el nombre del contacto
      • Incluir testimonios de clientes satisfechos
      • Agregar urgencia con contador de tiempo
      • Optimizar para dispositivos móviles
      • Realizar A/B testing con diferentes subject lines
    `
  }

  if (!isAIAvailable) {
    return fallback
  }

  try {
    const { text } = await generateText({
      model: xai('grok-3'),
      prompt: aiPrompt,
      maxTokens: 800,
    })

    // Parsear la respuesta (simplificado)
    const lines = text.split('\n')
    const subject = lines.find(line => line.includes('Subject:'))?.replace('Subject:', '').trim() || fallback.subject
    const contentStart = text.indexOf('Contenido:')
    const recommendationsStart = text.indexOf('Recomendaciones:')
    
    const content = contentStart > -1 && recommendationsStart > -1 
      ? text.substring(contentStart + 10, recommendationsStart).trim()
      : fallback.content
    
    const recommendations = recommendationsStart > -1 
      ? text.substring(recommendationsStart + 15).trim()
      : fallback.recommendations

    return { subject, content, recommendations }
  } catch (error) {
    console.error('AI campaign generation failed:', error)
    return fallback
  }
}

export async function generateMarketingInsights(campaigns: any[]): Promise<string> {
  const prompt = `
    Analiza las siguientes campañas de marketing y proporciona insights:
    
    ${campaigns.map(c => `
    - ${c.name}: ${c.status}, Open Rate: ${c.open_rate}%, Click Rate: ${c.click_rate}%
    `).join('')}
    
    Proporciona:
    1. Análisis de rendimiento general
    2. Campañas con mejor performance
    3. Áreas de mejora identificadas
    4. Recomendaciones específicas
    
    Responde en español de forma estratégica.
  `

  const fallback = `
    ## 📈 Análisis de Campañas de Marketing

    **Rendimiento General:** Las campañas muestran un engagement promedio del 35% en apertura y 10% en clicks, indicando una audiencia receptiva pero con oportunidades de mejora.

    **Mejores Performers:**
    • Campañas con ofertas específicas tienen mayor engagement
    • Contenido personalizado genera más clicks
    • Timing de envío impacta significativamente

    **Áreas de Mejora:**
    • Segmentación más granular de audiencias
    • Optimización de subject lines
    • Mejora en call-to-actions

    **Recomendaciones:**
    1. Implementar A/B testing sistemático
    2. Personalizar contenido por segmento
    3. Optimizar horarios de envío
    4. Crear secuencias automatizadas
    5. Mejorar diseño responsive
  `

  return generateWithFallback(prompt, fallback)
}

// IA para Comunicaciones
export async function generateCommunicationStrategy(contact: {
  name: string
  company: string
  status: string
  lastInteraction?: string
  dealValue?: number
}): Promise<string> {
  const prompt = `
    Genera una estrategia de comunicación personalizada para:
    
    Contacto: ${contact.name}
    Empresa: ${contact.company}
    Estado: ${contact.status}
    ${contact.lastInteraction ? `Última interacción: ${contact.lastInteraction}` : ''}
    ${contact.dealValue ? `Valor potencial: $${contact.dealValue}` : ''}
    
    Proporciona:
    1. Enfoque de comunicación recomendado
    2. Frecuencia de contacto sugerida
    3. Canales de comunicación preferidos
    4. Mensajes clave a transmitir
    5. Próximas acciones específicas
    
    Responde en español de forma práctica.
  `

  const fallback = `
    ## 💬 Estrategia de Comunicación - ${contact.name}

    **Enfoque Recomendado:** Comunicación consultiva y orientada a valor, enfocándose en entender necesidades específicas de ${contact.company}.

    **Frecuencia Sugerida:**
    • Contacto inicial: Inmediato
    • Seguimiento: Cada 7-10 días
    • Mantenimiento: Mensual

    **Canales Preferidos:**
    1. Email profesional (principal)
    2. LinkedIn para contenido de valor
    3. Llamadas telefónicas para temas urgentes
    4. Video llamadas para presentaciones

    **Mensajes Clave:**
    • Expertise en soluciones para su industria
    • Casos de éxito similares
    • ROI y beneficios tangibles
    • Soporte personalizado

    **Próximas Acciones:**
    1. Enviar email de seguimiento personalizado
    2. Compartir caso de estudio relevante
    3. Proponer reunión de descubrimiento
    4. Conectar en LinkedIn con mensaje personalizado
  `

  return generateWithFallback(prompt, fallback)
}

// IA para Actividades
export async function generateActivityRecommendations(activities: any[]): Promise<string> {
  const prompt = `
    Analiza las siguientes actividades y proporciona recomendaciones de priorización:
    
    ${activities.map(a => `
    - ${a.title} (${a.type}): ${a.status} - ${a.company}
    `).join('')}
    
    Proporciona:
    1. Priorización de actividades por impacto
    2. Identificación de oportunidades críticas
    3. Recomendaciones de optimización de tiempo
    4. Próximas acciones sugeridas
    
    Responde en español de forma ejecutiva.
  `

  const fallback = `
    ## ⚡ Recomendaciones de Actividades

    **Priorización por Impacto:**
    1. **Alta Prioridad:** Actividades de cierre con clientes calificados
    2. **Media Prioridad:** Seguimientos de propuestas enviadas
    3. **Baja Prioridad:** Actividades de prospección inicial

    **Oportunidades Críticas:**
    • Deals en etapa de negociación requieren atención inmediata
    • Contactos sin seguimiento por más de 7 días
    • Propuestas pendientes de respuesta

    **Optimización de Tiempo:**
    • Agrupar llamadas en bloques de 2 horas
    • Automatizar emails de seguimiento
    • Usar plantillas para propuestas estándar
    • Programar reuniones consecutivas

    **Próximas Acciones:**
    1. Contactar inmediatamente deals en negociación
    2. Enviar recordatorios de propuestas pendientes
    3. Programar llamadas de seguimiento
    4. Actualizar pipeline con información reciente
  `

  return generateWithFallback(prompt, fallback)
}
