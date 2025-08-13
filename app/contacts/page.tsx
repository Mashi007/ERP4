import { Suspense } from "react"
import ContactsClient from "./contacts-client"

export default function ContactsPage() {
  return (
    <Suspense fallback={<ContactsPageSkeleton />}>
      <ContactsClient />
    </Suspense>
  )
}

function ContactsPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
