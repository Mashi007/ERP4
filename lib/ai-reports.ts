import { xai } from '@ai-sdk/xai'
import { generateText, streamText } from 'ai'
import { sql, mockDeals, mockContacts, mockActivities } from './database'

export interface PipelineData {
  totalDeals: number
  totalValue: number
  stageDistribution: { stage: string; count: number; value: number }[]
  topDeals: { title: string; company: string; value: number; stage: string }[]
  conversionRates: { stage: string; rate: number }[]
  monthlyTrends: { month: string; deals: number; value: number }[]
}

export async function getPipelineData(): Promise<PipelineData> {
  try {
    let deals: any[]

    // Si hay base de datos configurada, usar datos reales
    if (sql && process.env.DATABASE_URL) {
      deals = await sql`
        SELECT title, company, value, stage, expected_close_date, created_at
        FROM deals 
        ORDER BY value DESC
      `
    } else {
      // Usar datos mock si no hay base de datos
      deals = mockDeals.map(deal => ({
        title: deal.title,
        company: deal.company,
        value: deal.value,
        stage: deal.stage,
        expected_close_date: deal.expected_close_date,
        created_at: deal.created_at
      }))
    }

    // Calcular métricas
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum: number, deal: any) => sum + Number(deal.value), 0)

    // Distribución por etapa
    const stageDistribution = deals.reduce((acc: any, deal: any) => {
      const existing = acc.find((item: any) => item.stage === deal.stage)
      if (existing) {
        existing.count += 1
        existing.value += Number(deal.value)
      } else {
        acc.push({ stage: deal.stage, count: 1, value: Number(deal.value) })
      }
      return acc
    }, [])

    // Top 5 deals
    const topDeals = deals.slice(0, 5).map((deal: any) => ({
      title: deal.title,
      company: deal.company,
      value: Number(deal.value),
      stage: deal.stage
    }))

    // Tasas de conversión simuladas
    const conversionRates = [
      { stage: 'Nuevo', rate: 25 },
      { stage: 'Calificación', rate: 40 },
      { stage: 'Descubrimiento', rate: 60 },
      { stage: 'Demo', rate: 70 },
      { stage: 'Negociación', rate: 85 },
      { stage: 'Ganado', rate: 100 }
    ]

    // Tendencias mensuales simuladas
    const monthlyTrends = [
      { month: 'Enero', deals: 12, value: 45000 },
      { month: 'Febrero', deals: 15, value: 52000 },
      { month: 'Marzo', deals: 18, value: 61000 },
      { month: 'Abril', deals: 14, value: 48000 },
      { month: 'Mayo', deals: 20, value: 67000 },
      { month: 'Junio', deals: 16, value: 55000 }
    ]

    return {
      totalDeals,
      totalValue,
      stageDistribution,
      topDeals,
      conversionRates,
      monthlyTrends
    }
  } catch (error) {
    console.error('Error fetching pipeline data:', error)
    
    // Fallback a datos mock en caso de error
    const deals = mockDeals
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)

    const stageDistribution = deals.reduce((acc: any, deal) => {
      const existing = acc.find((item: any) => item.stage === deal.stage)
      if (existing) {
        existing.count += 1
        existing.value += deal.value
      } else {
        acc.push({ stage: deal.stage, count: 1, value: deal.value })
      }
      return acc
    }, [])

    const topDeals = deals.slice(0, 5).map(deal => ({
      title: deal.title,
      company: deal.company,
      value: deal.value,
      stage: deal.stage
    }))

    return {
      totalDeals,
      totalValue,
      stageDistribution,
      topDeals,
      conversionRates: [
        { stage: 'Nuevo', rate: 25 },
        { stage: 'Calificación', rate: 40 },
        { stage: 'Descubrimiento', rate: 60 },
        { stage: 'Demo', rate: 70 },
        { stage: 'Negociación', rate: 85 },
        { stage: 'Ganado', rate: 100 }
      ],
      monthlyTrends: [
        { month: 'Enero', deals: 12, value: 45000 },
        { month: 'Febrero', deals: 15, value: 52000 },
        { month: 'Marzo', deals: 18, value: 61000 },
        { month: 'Abril', deals: 14, value: 48000 },
        { month: 'Mayo', deals: 20, value: 67000 },
        { month: 'Junio', deals: 16, value: 55000 }
      ]
    }
  }
}

export async function generatePipelineReport(data: PipelineData): Promise<string> {
  try {
    // Verificar si xAI está configurado
    if (!process.env.XAI_API_KEY) {
      return `
# INFORME EJECUTIVO DEL PIPELINE DE VENTAS

## Resumen Ejecutivo
Su pipeline actual muestra ${data.totalDeals} oportunidades activas con un valor total de $${data.totalValue.toLocaleString()}.

## Distribución por Etapa
${data.stageDistribution.map(stage => 
  `- **${stage.stage}**: ${stage.count} deals ($${stage.value.toLocaleString()})`
).join('\n')}

## Top 5 Oportunidades
${data.topDeals.map(deal => 
  `- ${deal.title} (${deal.company}): $${deal.value.toLocaleString()} - ${deal.stage}`
).join('\n')}

## Análisis y Recomendaciones

### Fortalezas Identificadas
- Pipeline diversificado con oportunidades en múltiples etapas
- Deals de alto valor en etapas avanzadas
- Buena distribución de riesgo

### Áreas de Mejora
- Enfocarse en acelerar deals en etapa de Negociación
- Incrementar la generación de leads en etapa Nuevo
- Mejorar la conversión en etapas tempranas

### Recomendaciones Estratégicas
1. Priorizar seguimiento de deals de alto valor
2. Implementar procesos de nurturing para leads nuevos
3. Establecer métricas de conversión por etapa
4. Crear playbooks específicos para cada etapa

### Predicciones
Basado en las tendencias actuales, se proyecta un crecimiento del 15% en el próximo trimestre.

*Nota: Para análisis más detallados con IA, configure la integración con xAI (Grok).*
      `
    }

    const prompt = `
    Analiza los siguientes datos del pipeline de ventas y genera un informe ejecutivo en español:

    DATOS DEL PIPELINE:
    - Total de oportunidades: ${data.totalDeals}
    - Valor total del pipeline: $${data.totalValue.toLocaleString()}
    
    DISTRIBUCIÓN POR ETAPA:
    ${data.stageDistribution.map(stage => 
      `- ${stage.stage}: ${stage.count} deals ($${stage.value.toLocaleString()})`
    ).join('\n')}
    
    TOP 5 OPORTUNIDADES:
    ${data.topDeals.map(deal => 
      `- ${deal.title} (${deal.company}): $${deal.value.toLocaleString()} - ${deal.stage}`
    ).join('\n')}
    
    TASAS DE CONVERSIÓN:
    ${data.conversionRates.map(rate => 
      `- ${rate.stage}: ${rate.rate}%`
    ).join('\n')}
    
    TENDENCIAS MENSUALES:
    ${data.monthlyTrends.map(trend => 
      `- ${trend.month}: ${trend.deals} deals ($${trend.value.toLocaleString()})`
    ).join('\n')}

    Por favor, proporciona:
    1. Resumen ejecutivo
    2. Análisis de fortalezas y debilidades
    3. Recomendaciones estratégicas
    4. Predicciones y oportunidades de mejora
    5. Métricas clave a monitorear

    Mantén un tono profesional y enfócate en insights accionables.
    `

    const { text } = await generateText({
      model: xai('grok-beta'),
      prompt,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error('Error generating report:', error)
    
    // Fallback report si falla la IA
    return `
# INFORME EJECUTIVO DEL PIPELINE DE VENTAS

## Resumen Ejecutivo
Su pipeline actual muestra ${data.totalDeals} oportunidades activas con un valor total de $${data.totalValue.toLocaleString()}.

## Distribución por Etapa
${data.stageDistribution.map(stage => 
  `- **${stage.stage}**: ${stage.count} deals ($${stage.value.toLocaleString()})`
).join('\n')}

## Top 5 Oportunidades
${data.topDeals.map(deal => 
  `- ${deal.title} (${deal.company}): $${deal.value.toLocaleString()} - ${deal.stage}`
).join('\n')}

## Análisis y Recomendaciones

### Fortalezas Identificadas
- Pipeline diversificado con oportunidades en múltiples etapas
- Deals de alto valor en etapas avanzadas
- Buena distribución de riesgo

### Áreas de Mejora
- Enfocarse en acelerar deals en etapa de Negociación
- Incrementar la generación de leads en etapa Nuevo
- Mejorar la conversión en etapas tempranas

### Recomendaciones Estratégicas
1. Priorizar seguimiento de deals de alto valor
2. Implementar procesos de nurturing para leads nuevos
3. Establecer métricas de conversión por etapa
4. Crear playbooks específicos para cada etapa

### Predicciones
Basado en las tendencias actuales, se proyecta un crecimiento del 15% en el próximo trimestre.

*Nota: Error al conectar con IA. Mostrando análisis básico.*
    `
  }
}

export async function generateDealInsights(dealId: number): Promise<string> {
  try {
    let dealData: any[]

    if (sql && process.env.DATABASE_URL) {
      dealData = await sql`
        SELECT d.*, c.name as contact_name, c.email as contact_email, c.job_title
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.id = ${dealId}
      `
    } else {
      // Usar datos mock
      const deal = mockDeals.find(d => d.id === dealId)
      const contact = deal?.contact_id ? mockContacts.find(c => c.id === deal.contact_id) : null
      
      if (!deal) {
        throw new Error('Deal not found')
      }

      dealData = [{
        ...deal,
        contact_name: contact?.name || null,
        contact_email: contact?.email || null,
        job_title: contact?.job_title || null
      }]
    }

    if (!dealData.length) {
      throw new Error('Deal not found')
    }

    const deal = dealData[0]

    if (!process.env.XAI_API_KEY) {
      return `
# ANÁLISIS DE OPORTUNIDAD: ${deal.title}

## Información General
- **Empresa**: ${deal.company}
- **Valor**: $${Number(deal.value).toLocaleString()}
- **Etapa**: ${deal.stage}
- **Probabilidad**: ${deal.probability}%
- **Contacto**: ${deal.contact_name || 'No asignado'}

## Análisis Básico
Esta oportunidad se encuentra en la etapa de ${deal.stage} con una probabilidad de cierre del ${deal.probability}%.

## Recomendaciones
1. Mantener comunicación regular con el contacto
2. Preparar propuesta detallada si está en etapas avanzadas
3. Identificar decisores clave en la organización
4. Establecer timeline claro para el cierre

*Para análisis más detallado, configure la integración con xAI.*
      `
    }

    const prompt = `
    Analiza esta oportunidad de venta y proporciona insights estratégicos:

    INFORMACIÓN DEL DEAL:
    - Título: ${deal.title}
    - Empresa: ${deal.company}
    - Valor: $${Number(deal.value).toLocaleString()}
    - Etapa actual: ${deal.stage}
    - Probabilidad: ${deal.probability}%
    - Fecha esperada de cierre: ${deal.expected_close_date || 'No definida'}
    - Contacto: ${deal.contact_name || 'No asignado'} (${deal.job_title || 'Sin cargo'})
    - Notas: ${deal.notes || 'Sin notas'}

    Proporciona:
    1. Análisis de la oportunidad
    2. Factores de riesgo identificados
    3. Estrategias para avanzar al siguiente paso
    4. Recomendaciones de seguimiento
    5. Probabilidad realista de cierre

    Sé específico y práctico en tus recomendaciones.
    `

    const { text } = await generateText({
      model: xai('grok-beta'),
      prompt,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error('Error generating deal insights:', error)
    return 'Error al generar insights del deal. Verifique la configuración de la base de datos y xAI.'
  }
}

export async function generateContactStrategy(contactId: number): Promise<string> {
  try {
    let contactData: any[]

    if (sql && process.env.DATABASE_URL) {
      contactData = await sql`
        SELECT c.*, 
               COUNT(d.id) as total_deals,
               SUM(d.value) as total_value,
               STRING_AGG(d.stage, ', ') as deal_stages
        FROM contacts c
        LEFT JOIN deals d ON c.id = d.contact_id
        WHERE c.id = ${contactId}
        GROUP BY c.id
      `
    } else {
      // Usar datos mock
      const contact = mockContacts.find(c => c.id === contactId)
      if (!contact) {
        throw new Error('Contact not found')
      }

      const relatedDeals = mockDeals.filter(d => d.contact_id === contactId)
      const totalValue = relatedDeals.reduce((sum, deal) => sum + deal.value, 0)
      const dealStages = relatedDeals.map(d => d.stage).join(', ')

      contactData = [{
        ...contact,
        total_deals: relatedDeals.length,
        total_value: totalValue,
        deal_stages: dealStages
      }]
    }

    if (!contactData.length) {
      throw new Error('Contact not found')
    }

    const contact = contactData[0]

    if (!process.env.XAI_API_KEY) {
      return `
# ESTRATEGIA DE CONTACTO: ${contact.name}

## Perfil del Contacto
- **Empresa**: ${contact.company || 'No especificada'}
- **Cargo**: ${contact.job_title || 'No especificado'}
- **Estado**: ${contact.status}
- **Deals activos**: ${contact.total_deals || 0}

## Estrategia Recomendada
1. **Comunicación**: Mantener contacto regular basado en su perfil profesional
2. **Valor**: Enfocar conversaciones en beneficios específicos para su rol
3. **Timing**: Respetar su agenda y preferencias de comunicación
4. **Seguimiento**: Establecer cadencia apropiada según la etapa del deal

*Para estrategias más personalizadas, configure la integración con xAI.*
      `
    }

    const prompt = `
    Desarrolla una estrategia de engagement para este contacto:

    INFORMACIÓN DEL CONTACTO:
    - Nombre: ${contact.name}
    - Empresa: ${contact.company || 'No especificada'}
    - Cargo: ${contact.job_title || 'No especificado'}
    - Email: ${contact.email || 'No disponible'}
    - Estado: ${contact.status}
    - Etiquetas: ${contact.tags?.join(', ') || 'Sin etiquetas'}
    - Total de deals: ${contact.total_deals || 0}
    - Valor total: $${Number(contact.total_value || 0).toLocaleString()}
    - Etapas de deals: ${contact.deal_stages || 'Sin deals activos'}

    Proporciona:
    1. Perfil del contacto y su influencia
    2. Estrategia de comunicación personalizada
    3. Temas de conversación relevantes
    4. Frecuencia de seguimiento recomendada
    5. Próximos pasos sugeridos

    Enfócate en construir una relación sólida y de valor mutuo.
    `

    const { text } = await generateText({
      model: xai('grok-beta'),
      prompt,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error('Error generating contact strategy:', error)
    return 'Error al generar estrategia de contacto. Verifique la configuración.'
  }
}
