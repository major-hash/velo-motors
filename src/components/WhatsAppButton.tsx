import { whatsappLink } from '../lib/supabase'

export default function WhatsAppButton({ message, floating = false }: { message?: string; floating?: boolean }) {
  const text = message ?? "Hello Velo Motors, I'd like to know more about your inventory."
  const href = whatsappLink(text)

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.9.5 3.66 1.44 5.24L2 22l4.99-1.5a9.9 9.9 0 0 0 5.05 1.38c5.46 0 9.91-4.45 9.91-9.9C21.95 6.44 17.5 2 12.04 2Zm5.8 14.2c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.28-3.42-.72-2.88-1.2-4.72-4.1-4.86-4.3-.14-.2-1.16-1.55-1.16-2.95 0-1.4.73-2.08.99-2.36.26-.28.56-.34.75-.34l.54.01c.17 0 .4-.06.63.48.24.56.8 1.96.87 2.1.07.14.11.3.02.5-.1.2-.15.3-.29.46-.14.16-.3.36-.43.48-.14.14-.29.28-.13.56.17.28.75 1.24 1.6 2.01 1.11 1 2.04 1.3 2.32 1.45.28.14.44.12.6-.07.17-.2.72-.83.9-1.12.2-.28.38-.23.65-.14.26.1 1.67.79 1.96.93.28.14.47.2.54.32.07.12.07.68-.16 1.35Z"/></svg>
      </a>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2">
      Chat on WhatsApp
    </a>
  )
}
