"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-lg border border-brand-300 bg-brand-50 p-6 text-brand-700">
        Gracias por escribirnos. Te vamos a responder a la brevedad.
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        // V1: envío básico, sin persistencia. Preparar integración futura
        // con backend/base de datos.
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-fg">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-fg">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-fg">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
        />
      </div>
      <Button type="submit">Enviar mensaje</Button>
    </form>
  );
}
