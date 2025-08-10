'use server'

import { getPipelineData, generatePipelineReport, generateDealInsights, generateContactStrategy } from '@/lib/ai-reports'

export async function generateAIReport() {
  try {
    const pipelineData = await getPipelineData()
    const report = await generatePipelineReport(pipelineData)
    return { success: true, report, data: pipelineData }
  } catch (error) {
    console.error('Error generating AI report:', error)
    return { success: false, error: 'Failed to generate report' }
  }
}

export async function generateDealAnalysis(dealId: number) {
  try {
    const insights = await generateDealInsights(dealId)
    return { success: true, insights }
  } catch (error) {
    console.error('Error generating deal analysis:', error)
    return { success: false, error: 'Failed to generate deal analysis' }
  }
}

export async function generateContactAnalysis(contactId: number) {
  try {
    const strategy = await generateContactStrategy(contactId)
    return { success: true, strategy }
  } catch (error) {
    console.error('Error generating contact analysis:', error)
    return { success: false, error: 'Failed to generate contact analysis' }
  }
}
