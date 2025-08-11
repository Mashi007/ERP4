# Arquitectura de datos e integración de módulos

## Conexión
- `lib/database.ts` crea un cliente Neon (`sql`) cuando `DATABASE_URL` está disponible y define los tipos TypeScript para las tablas.
- Todos los módulos importan `sql` y `getDataWithFallback` desde `lib/database.ts` para consultar BD real o caer a datos mock consistentes.

## Tablas principales y relaciones
- `contacts` (base de clientes)
- `deals` (oportunidades) con `contact_id -> contacts.id`
- `activities` con `contact_id -> contacts.id` y `deal_id -> deals.id`
- `appointments` con `contact_id -> contacts.id` y `deal_id -> deals.id`
- `conversations` con `contact_id -> contacts.id`
- `messages` con `conversation_id -> conversations.id`
- `marketing_lists`
- `marketing_list_contacts` con `list_id -> marketing_lists.id` y `contact_id -> contacts.id`
- `marketing_campaigns` con `list_id -> marketing_lists.id`

## Módulos
- Clientes: lee/escribe `contacts`.
- Pipeline/Oportunidades: `deals` (relación con `contacts`). Cambios de etapa generan `activities`.
- Actividades: `activities` (vinculadas a contacto y/o deal).
- Citas/Calendario: `appointments` (vinculadas a contacto y/o deal).
- Comunicaciones: `conversations` y `messages` (vinculadas a contactos).
- Marketing: `marketing_lists`, `marketing_list_contacts`, `marketing_campaigns`.

## Dashboard
- `app/dashboard/actions.ts` agrega datos de `deals`, `contacts`, `activities`, `appointments` y calcula:
  - KPIs (ingresos ganados/perdidos)
  - Funnel por etapa (valor abierto)
  - % win/loss
  - Contactos y tareas por propietario
  - Pronóstico por trimestre/etapa
  - Ingresos por fuente (`deals.lead_source`)
  - Ciclo medio de ventas, conversión por etapa y rendimiento por propietario
- Filtros globales: fecha, industria y fuente. En modo mock, si un rango deja sin resultados, hay fallback para evitar panel vacío.

## UI y navegación
- Sidebar agrupa módulos y navegación. Es componible con shadcn/ui y puede colapsar o ser inset sin afectar datos.
- Puedes reordenar/ocultar módulos; la integración con el Dashboard sigue funcionando porque éste consulta directamente las tablas.

## IA
- Las funciones de IA (resúmenes, campañas, insights) usan el AI SDK de Vercel y consumen datos de los módulos cuando es necesario.

## Comprobaciones
- `app/api/health/neon/route.ts`: verifica conectividad a BD.
- Revalidaciones (`revalidatePath`) tras crear/actualizar/eliminar datos en módulos para reflejar cambios en el Dashboard.
