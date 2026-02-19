/* eslint-disable @next/next/no-img-element */
"use client";

import { hotelContent } from "@/lib/content/hotel-content";

function normalizeWhatsAppNumber(input: string): string {
  // WhatsApp wa.me expects digits only, with country code (no leading +).
  // Examples:
  // "+91 9369353505" -> "919369353505"
  // "919369353505" -> "919369353505"
  const digitsOnly = (input ?? "").replace(/[^\d]/g, "");
  return digitsOnly;
}

export function WhatsAppFloater() {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const envMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE;

  const phoneRaw = envNumber?.trim() || hotelContent.contact.phone;
  const phone = normalizeWhatsAppNumber(phoneRaw);

  // If no phone is configured, don't render anything (avoids broken link in prod).
  if (!phone) return null;

  const message = (envMessage?.trim() || hotelContent.social.whatsapp.greeting).trim();
  const href = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl shadow-black/10 ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
        <span className="absolute inset-0 rounded-full bg-white/15 opacity-0 transition group-hover:opacity-100" />
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 opacity-60 blur-md transition group-hover:opacity-90" />
        <span className="absolute inset-0 rounded-full animate-ping bg-white/20" />
        {/* WhatsApp icon (inline SVG to avoid extra deps) */}
        <svg
          viewBox="0 0 32 32"
          className="relative h-5 w-5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.3c-.28-.14-1.63-.8-1.88-.9-.25-.1-.43-.14-.6.14-.18.28-.69.9-.84 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.34-.02-.48-.07-.14-.6-1.44-.83-1.98-.22-.53-.44-.46-.6-.46l-.52-.01c-.18 0-.46.07-.7.34-.24.28-.93.91-.93 2.21 0 1.3.96 2.56 1.1 2.74.14.18 1.89 2.9 4.58 4.06.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.63-.67 1.86-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z" />
          <path d="M26.69 5.31C23.83 2.45 20.02.88 16 .88 7.97.88 1.44 7.41 1.44 15.44c0 2.57.67 5.07 1.95 7.28L1.32 31.12l8.58-2.25c2.13 1.16 4.54 1.77 7 1.77h.01c8.03 0 14.56-6.53 14.56-14.56 0-4.02-1.57-7.83-4.38-10.77zM16.91 28.2h-.01c-2.17 0-4.3-.58-6.15-1.68l-.44-.26-5.09 1.33 1.36-4.96-.29-.51a12.62 12.62 0 0 1-1.94-6.68c0-6.96 5.66-12.62 12.62-12.62 3.37 0 6.54 1.31 8.93 3.7a12.53 12.53 0 0 1 3.7 8.93c0 6.96-5.66 12.75-12.69 12.75z" />
        </svg>
      </span>

      <span className="hidden sm:flex flex-col leading-tight">
        <span className="text-[13px] font-medium tracking-[0.02em] opacity-90">Need help?</span>
        <span className="text-[15px] font-semibold tracking-[0.01em]">WhatsApp us</span>
      </span>
    </a>
  );
}


