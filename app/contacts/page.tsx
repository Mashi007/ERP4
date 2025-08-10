import { Suspense } from 'react'
import { getDataWithFallback, mockContacts, sql, type Contact } from '@/lib/database'
import ContactsClient from './contacts-client'

async function getContacts(): Promise<Contact[]> {
  return await getDataWithFallback(
    async () => {
      if (!sql) throw new Error('Database not configured')
      return await sql`SELECT * FROM contacts ORDER BY created_at DESC`
    },
    mockContacts
  )
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <Suspense fallback={<div>Cargando contactos...</div>}>
      <ContactsClient initialContacts={contacts} />
    </Suspense>
  )
}
