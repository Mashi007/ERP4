"use client"

import type React from "react"

type WhatsAppChatLinkProps = {
  phone?: string
  message?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Renders the exact anchor required to open a WhatsApp chat with a prefilled message.
 * Defaults:
 *  - phone: 593983000700
 *  - message: "Hola, vi su sitio web y quisiera más información."
 *
 * You can wrap any custom children, or it will render "Contáctanos por WhatsApp" by default.
 */
export function WhatsAppChatLink({
  phone = "593983000700",
  message = "Hola, vi su sitio web y quisiera más información.",
  children,
  className,
}: WhatsAppChatLinkProps) {
  const href = `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(message)}`
  // Keep the inline style per the user’s request.
  const baseStyle =
    "background-color: #25D366; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: "#25D366",
        color: "white",
        padding: "10px 20px",
        borderRadius: 5,
        textDecoration: "none",
        fontWeight: "bold",
        display: "inline-block",
      }}
      className={className}
      aria-label="Abrir chat de WhatsApp"
    >
      {children ?? "Contáctanos por WhatsApp"}
    </a>
  )
}
