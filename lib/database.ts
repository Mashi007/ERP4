import { neon } from '@neondatabase/serverless'

// Verificar si DATABASE_URL está disponible, si no, usar datos mock
const isDatabaseAvailable = !!process.env.DATABASE_URL

export const sql = isDatabaseAvailable ? neon(process.env.DATABASE_URL!) : null

// Tipos TypeScript para las tablas
export interface Contact {
  id: number
  name: string
  email: string | null
  phone: string | null
  company: string | null
  job_title: string | null
  status: string
  tags: string[]
  sales_owner: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Deal {
  id: number
  title: string
  company: string
  contact_id: number | null
  value: number
  stage: string
  probability: number
  expected_close_date: string | null
  notes: string | null
  sales_owner: string
  
  // Campos adicionales
  lead_source?: string | null
  industry?: string | null
  company_size?: string | null
  budget_range?: string | null
  decision_timeline?: string | null
  pain_points?: string | null
  competitors?: string | null
  next_steps?: string | null
  
  created_at: string
  updated_at: string
}

export interface Activity {
  id: number
  type: string
  title: string
  contact_id: number | null
  deal_id: number | null
  company: string | null
  activity_date: string
  activity_time: string | null
  duration: number | null
  status: string
  notes: string | null
  sales_owner: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  title: string
  contact_id: number | null
  deal_id: number | null
  company: string | null
  appointment_date: string
  appointment_time: string | null
  duration: number | null
  type: string
  location: string | null
  status: string
  notes: string | null
  sales_owner: string
  created_at: string
  updated_at: string
}

export interface MarketingList {
  id: number
  name: string
  description: string | null
  status: string
  tags: string[]
  created_at: string
  updated_at: string
  contact_count?: number
}

export interface MarketingCampaign {
  id: number
  name: string
  type: string
  status: string
  subject: string | null
  content: string | null
  list_id: number | null
  scheduled_at: string | null
  sent_at: string | null
  sent_count: number
  opened_count: number
  clicked_count: number
  open_rate: number
  click_rate: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: number
  contact_id: number | null
  subject: string | null
  status: string
  last_message_at: string
  created_at: string
  updated_at: string
  contact_name?: string
  contact_company?: string
  contact_avatar?: string
}

export interface Message {
  id: number
  conversation_id: number
  sender_type: string
  sender_name: string | null
  sender_email: string | null
  content: string
  message_type: string
  is_read: boolean
  has_attachment: boolean
  sent_at: string
  created_at: string
}

export interface CommunicationSetting {
  id: number
  user_id: string
  provider_type: string
  provider_name: string
  is_connected: boolean
  is_favorite: boolean
  account_email: string | null
  settings: any
  created_at: string
  updated_at: string
}

// Función helper para obtener datos con fallback a mock
export async function getDataWithFallback<T>(
  queryFn: () => Promise<T[]>,
  mockData: T[]
): Promise<T[]> {
  if (!sql || !process.env.DATABASE_URL) {
    return mockData
  }
  
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query failed, using mock data:', error)
    return mockData
  }
}

// Datos mock actualizados para todos los módulos
export const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Johnny Appleseed",
    email: "johnny.appleseed@jetpropulsion.com",
    phone: "+ Click to add",
    company: "Jet Propulsion Labs",
    job_title: "Manager Customer Relations",
    status: "New",
    tags: [],
    sales_owner: "Daniel Casañas",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Spector Calista",
    email: "spectorcalista@gmail.com",
    phone: "+19266520001",
    company: "Techcave",
    job_title: "Co-founder",
    status: "Qualified",
    tags: ["Industry Expert"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/professional-man.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Jane Sampleton",
    email: "janesampleton@gmail.com",
    phone: "+19266529503",
    company: "Widgetz.io",
    job_title: "CEO",
    status: "Qualified",
    tags: ["Decision maker"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/professional-woman-diverse.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Emily Dean",
    email: "emily.dean@globallearning.com",
    phone: "+ Click to add",
    company: "Global Learning Solutions",
    job_title: "Chartered Accountant",
    status: "New",
    tags: [],
    sales_owner: "Daniel Casañas",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Martha Jackson",
    email: "marthajackson@gmail.com",
    phone: "+19266091164",
    company: "Optiscape Inc",
    job_title: "COO",
    status: "Won",
    tags: ["High-Value Customer"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/confident-business-woman.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Kevin Jordan",
    email: "kevinjordan@gmail.com",
    phone: "+15898899911",
    company: "Apex IQ",
    job_title: "VP Marketing",
    status: "Won",
    tags: ["Customer Advocate"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/marketing-executive.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "Syed Kareem",
    email: "syedkareem@gmail.com",
    phone: "+447456123456",
    company: "Synth Corp",
    job_title: "Project Manager",
    status: "Qualified",
    tags: ["Influencer"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/project-manager-team.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Heather White",
    email: "heatherwhite@gmail.com",
    phone: "+15436946523",
    company: "Pivotal Tech",
    job_title: "Head of IT",
    status: "Qualified",
    tags: ["Champion"],
    sales_owner: "Daniel Casañas",
    avatar_url: "/it-director.png",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockDeals: Deal[] = [
  {
    id: 1,
    title: "Renovación ECorp",
    company: "E Corp",
    contact_id: 1,
    value: 4000.00,
    stage: "Nuevo",
    probability: 25,
    expected_close_date: "2024-08-15",
    notes: "Cliente muy interesado, esperando aprobación del presupuesto",
    sales_owner: "Daniel Casañas",
    lead_source: "Referido",
    industry: "Tecnología",
    company_size: "201-1000",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "1-3 meses",
    pain_points: "Sistema actual obsoleto, necesitan modernización",
    competitors: "Salesforce, HubSpot",
    next_steps: "Enviar propuesta detallada la próxima semana",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Implementación Widgetz.io",
    company: "Widgetz.io",
    contact_id: 3,
    value: 5600.00,
    stage: "Nuevo",
    probability: 30,
    expected_close_date: "2024-10-15",
    notes: "CRM - Plan Oro, necesidades específicas de integración",
    sales_owner: "Daniel Casañas",
    lead_source: "Website",
    industry: "Software",
    company_size: "51-200",
    budget_range: "$5,000 - $25,000",
    decision_timeline: "3-6 meses",
    pain_points: "Crecimiento rápido, necesitan escalabilidad",
    competitors: "Pipedrive, Zoho",
    next_steps: "Programar demo técnica con equipo de desarrollo",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    title: "Consultoría Acme Inc",
    company: "Acme Inc",
    contact_id: 2,
    value: 100.00,
    stage: "Calificación",
    probability: 15,
    expected_close_date: "2024-08-30",
    notes: "Startup pequeña, presupuesto limitado",
    sales_owner: "Daniel Casañas",
    lead_source: "Redes Sociales",
    industry: "Startup",
    company_size: "1-10",
    budget_range: "< $1,000",
    decision_timeline: "Inmediato",
    pain_points: "Presupuesto muy ajustado, buscan solución económica",
    competitors: "Herramientas gratuitas",
    next_steps: "Evaluar opciones de plan básico",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    title: "Desarrollo Synth Corp",
    company: "Synth Corp",
    contact_id: 7,
    value: 4100.00,
    stage: "Calificación",
    probability: 40,
    expected_close_date: "2024-08-20",
    notes: "Proyecto anual de desarrollo",
    sales_owner: "Daniel Casañas",
    lead_source: "Evento",
    industry: "Manufactura",
    company_size: "51-200",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "1-3 meses",
    pain_points: "Procesos manuales ineficientes",
    competitors: "SAP, Oracle",
    next_steps: "Realizar análisis de procesos actuales",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    title: "Soporte Técnico Techcave",
    company: "Techcave",
    contact_id: 2,
    value: 3200.00,
    stage: "Negociación",
    probability: 75,
    expected_close_date: "2024-08-10",
    notes: "CRM - Plan Oro, renovación de contrato",
    sales_owner: "Daniel Casañas",
    lead_source: "Cliente Existente",
    industry: "Tecnología",
    company_size: "11-50",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "Inmediato",
    pain_points: "Satisfechos con servicio actual, quieren expandir",
    competitors: "Ninguno identificado",
    next_steps: "Finalizar términos de renovación",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    title: "Renovación Techcave",
    company: "Techcave",
    contact_id: 2,
    value: 3000.00,
    stage: "Ganado",
    probability: 100,
    expected_close_date: "2024-08-10",
    notes: "CRM - Platinum, contrato cerrado",
    sales_owner: "Daniel Casañas",
    lead_source: "Cliente Existente",
    industry: "Tecnología",
    company_size: "11-50",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "Inmediato",
    pain_points: "Upgrade a plan premium por crecimiento",
    competitors: "N/A",
    next_steps: "Implementar nuevas funcionalidades",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    title: "Consultoría Optiscape",
    company: "Optiscape Inc",
    contact_id: 5,
    value: 2100.00,
    stage: "Ganado",
    probability: 100,
    expected_close_date: "2024-08-05",
    notes: "Sin productos adicionales",
    sales_owner: "Daniel Casañas",
    lead_source: "Referido",
    industry: "Consultoría",
    company_size: "51-200",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "Inmediato",
    pain_points: "Optimización de procesos de ventas",
    competitors: "N/A",
    next_steps: "Comenzar implementación",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    title: "Marketing Digital Apex IQ",
    company: "Apex IQ",
    contact_id: 6,
    value: 4200.00,
    stage: "Ganado",
    probability: 100,
    expected_close_date: "2024-07-15",
    notes: "CRM - Premium, proyecto completado",
    sales_owner: "Daniel Casañas",
    lead_source: "Email Marketing",
    industry: "Marketing",
    company_size: "51-200",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "Inmediato",
    pain_points: "Integración con herramientas de marketing",
    competitors: "N/A",
    next_steps: "Proyecto completado exitosamente",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 9,
    title: "Soluciones Globales",
    company: "Global Learning Solutions",
    contact_id: 4,
    value: 3000.00,
    stage: "Ganado",
    probability: 100,
    expected_close_date: "2024-06-20",
    notes: "Contrato anual firmado",
    sales_owner: "Daniel Casañas",
    lead_source: "Llamada Fría",
    industry: "Educación",
    company_size: "201-1000",
    budget_range: "$1,000 - $5,000",
    decision_timeline: "Inmediato",
    pain_points: "Gestión de estudiantes y cursos",
    competitors: "N/A",
    next_steps: "Renovación automática configurada",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockActivities: Activity[] = [
  {
    id: 1,
    type: "call",
    title: "Llamada de seguimiento",
    contact_id: 1,
    deal_id: null,
    company: "Jet Propulsion Labs",
    activity_date: "2024-01-15",
    activity_time: "10:30",
    duration: 30,
    status: "Completada",
    notes: "Discutimos los requerimientos del proyecto CRM",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    type: "email",
    title: "Envío de propuesta",
    contact_id: 3,
    deal_id: null,
    company: "Widgetz.io",
    activity_date: "2024-01-15",
    activity_time: "11:15",
    duration: 15,
    status: "Completada",
    notes: "Propuesta enviada con detalles de servicios",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    type: "meeting",
    title: "Reunión de presentación",
    contact_id: 7,
    deal_id: null,
    company: "Synth Corp",
    activity_date: "2024-01-15",
    activity_time: "14:00",
    duration: 60,
    status: "Programada",
    notes: "Presentación de soluciones para startup",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    type: "call",
    title: "Llamada de cierre",
    contact_id: 5,
    deal_id: null,
    company: "Optiscape Inc",
    activity_date: "2024-01-15",
    activity_time: "15:30",
    duration: 45,
    status: "Programada",
    notes: "Finalizar detalles del contrato anual",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    type: "meeting",
    title: "Demo del producto",
    contact_id: 6,
    deal_id: null,
    company: "Apex IQ",
    activity_date: "2024-01-16",
    activity_time: "09:00",
    duration: 90,
    status: "Programada",
    notes: "Demostración completa de la plataforma",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Reunión de seguimiento - CRM Implementation",
    contact_id: 1,
    deal_id: 1,
    company: "Jet Propulsion Labs",
    appointment_date: "2024-01-15",
    appointment_time: "10:00",
    duration: 60,
    type: "meeting",
    location: "Oficina principal",
    status: "confirmed",
    notes: "Revisar progreso de implementación y próximos pasos",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Demo de producto - Marketing Digital",
    contact_id: 3,
    deal_id: 2,
    company: "Widgetz.io",
    appointment_date: "2024-01-15",
    appointment_time: "14:30",
    duration: 45,
    type: "demo",
    location: "Video llamada",
    status: "confirmed",
    notes: "Demostración de funcionalidades avanzadas",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    title: "Consulta inicial - Desarrollo Web",
    contact_id: 2,
    deal_id: 3,
    company: "Techcave",
    appointment_date: "2024-01-16",
    appointment_time: "09:30",
    duration: 30,
    type: "consultation",
    location: "Café Central",
    status: "pending",
    notes: "Primera reunión para entender necesidades",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    title: "Presentación de propuesta",
    contact_id: 5,
    deal_id: 7,
    company: "Optiscape Inc",
    appointment_date: "2024-01-16",
    appointment_time: "16:00",
    duration: 90,
    type: "presentation",
    location: "Oficina del cliente",
    status: "confirmed",
    notes: "Presentación final de la propuesta comercial",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    title: "Llamada de cierre",
    contact_id: 6,
    deal_id: 8,
    company: "Apex IQ",
    appointment_date: "2024-01-17",
    appointment_time: "11:00",
    duration: 30,
    type: "call",
    location: "Llamada telefónica",
    status: "confirmed",
    notes: "Cerrar detalles finales del contrato",
    sales_owner: "Daniel Casañas",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export const mockMarketingLists: MarketingList[] = [
  {
    id: 1,
    name: "Lista Principal",
    description: "Todos los contactos activos del CRM",
    status: "active",
    tags: ["Clientes", "Activos"],
    contact_count: 1250,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Nuevos Suscriptores",
    description: "Contactos que se suscribieron en los últimos 30 días",
    status: "active",
    tags: ["Nuevos", "Suscriptores"],
    contact_count: 340,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-14T15:30:00Z"
  },
  {
    id: 3,
    name: "Clientes VIP",
    description: "Clientes de alto valor con compras superiores a $5000",
    status: "active",
    tags: ["VIP", "Premium"],
    contact_count: 89,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-12T09:20:00Z"
  },
  {
    id: 4,
    name: "Inactivos",
    description: "Contactos que no han interactuado en los últimos 90 días",
    status: "active",
    tags: ["Inactivos", "Re-engagement"],
    contact_count: 567,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-08T11:45:00Z"
  }
]

export const mockMarketingCampaigns: MarketingCampaign[] = [
  {
    id: 1,
    name: "Lanzamiento Producto Q1",
    type: "email",
    status: "completed",
    subject: "🚀 Nuevo Producto Disponible - Descuento Exclusivo",
    content: "Descubre nuestro nuevo producto con un 20% de descuento exclusivo para clientes VIP.",
    list_id: 1,
    scheduled_at: "2024-01-15T10:00:00Z",
    sent_at: "2024-01-15T10:00:00Z",
    sent_count: 1250,
    opened_count: 456,
    clicked_count: 89,
    open_rate: 36.5,
    click_rate: 7.1,
    created_by: "Daniel Casañas",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Promoción Envío Gratis",
    type: "email",
    status: "completed",
    subject: "🚚 Envío Gratis en Todos los Pedidos",
    content: "Por tiempo limitado, disfruta de envío gratuito en todas tus compras.",
    list_id: 2,
    scheduled_at: "2024-01-08T14:30:00Z",
    sent_at: "2024-01-08T14:30:00Z",
    sent_count: 980,
    opened_count: 412,
    clicked_count: 156,
    open_rate: 42.0,
    click_rate: 15.9,
    created_by: "Daniel Casañas",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-08T14:30:00Z"
  },
  {
    id: 3,
    name: "Programa Referidos",
    type: "email",
    status: "draft",
    subject: "👥 Refiere y Gana - Programa de Referidos",
    content: "Gana recompensas por cada amigo que refiera a nuestros servicios.",
    list_id: 3,
    scheduled_at: null,
    sent_at: null,
    sent_count: 0,
    opened_count: 0,
    clicked_count: 0,
    open_rate: 0,
    click_rate: 0,
    created_by: "Daniel Casañas",
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z"
  },
  {
    id: 4,
    name: "Descuento Nuevos Usuarios",
    type: "email",
    status: "scheduled",
    subject: "💰 Bienvenido - 15% de Descuento",
    content: "Como nuevo suscriptor, disfruta de un 15% de descuento en tu primera compra.",
    list_id: 2,
    scheduled_at: "2024-01-20T09:00:00Z",
    sent_at: null,
    sent_count: 0,
    opened_count: 0,
    clicked_count: 0,
    open_rate: 0,
    click_rate: 0,
    created_by: "Daniel Casañas",
    created_at: "2024-01-11T00:00:00Z",
    updated_at: "2024-01-11T00:00:00Z"
  }
]

export const mockConversations: Conversation[] = [
  {
    id: 1,
    contact_id: 1,
    subject: "Propuesta de implementación CRM",
    status: "active",
    last_message_at: "2024-01-15T10:30:00Z",
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    contact_name: "Juan Pérez",
    contact_company: "Tech Solutions Inc.",
    contact_avatar: "/professional-man.png"
  },
  {
    id: 2,
    contact_id: 3,
    subject: "Re: Consultoría Marketing Digital",
    status: "active",
    last_message_at: "2024-01-15T09:15:00Z",
    created_at: "2024-01-14T16:00:00Z",
    updated_at: "2024-01-15T09:15:00Z",
    contact_name: "María García",
    contact_company: "Marketing Pro",
    contact_avatar: "/professional-woman-diverse.png"
  },
  {
    id: 3,
    contact_id: 2,
    subject: "Presupuesto desarrollo web",
    status: "active",
    last_message_at: "2024-01-14T16:45:00Z",
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T16:45:00Z",
    contact_name: "Carlos López",
    contact_company: "StartupXYZ",
    contact_avatar: "/young-entrepreneur-casual.png"
  }
]
