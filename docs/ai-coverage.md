# Cobertura de IA en el CRM

Este documento resume dónde se usa IA y cómo verificar el estado:

## Integraciones activas

- Dashboard · Insights — lib/ai-enhanced.ts → generateDashboardInsights
- Citas · Insights — lib/ai-enhanced.ts → generateAppointmentInsights
- Marketing · Generación de campañas — lib/ai-enhanced.ts → generateMarketingCampaign
- Marketing · Insights — lib/ai-enhanced.ts → generateMarketingInsights
- Contactos · Estrategia de comunicación — lib/ai-enhanced.ts → generateCommunicationStrategy
- Actividades · Recomendaciones — lib/ai-enhanced.ts → generateActivityRecommendations
- Embudo · Informe ejecutivo — lib/ai-reports.ts → generatePipelineReport
- Oportunidades · Insights — lib/ai-reports.ts → generateDealInsights
- Contactos · Estrategia — lib/ai-reports.ts → generateContactStrategy
- Asistente · Chat CRM — lib/chat-ai.ts → generateChatResponse / streamChatResponse
- Cliente · Resumen con IA — app/clientes/[id]/actions.ts → askClientAI

## Estados

- Active (xAI): Se usa el modelo Grok cuando XAI_API_KEY está configurada.
- Fallback: Se usa lógica o textos por defecto. No requiere API key.

## Verificación

1. Abre /settings/ai.
2. Pulsa “Probar conexión AI” para verificar latencia y conectividad.
3. Revisa el listado de features: Active o Fallback.
4. En cada vista que consume IA, confirma que el UI muestra contenido generado cuando el estado es Active.

## Notas

- Todas las integraciones usan el AI SDK con el proveedor xAI (Grok). Ajustar modelo o parámetros según caso de uso.
- Sugerencia: añade métricas (latencia, tasa de fallo) y alertas en producción.
