import { redirect } from "next/navigation"

export default function ContactsPage() {
  redirect("/clientes?tab=contactos")
}
