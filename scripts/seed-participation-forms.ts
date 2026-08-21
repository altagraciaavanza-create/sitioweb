/**
 * Crea los formularios correspondientes a cada opción de /participa y los
 * asigna, para que cada tarjeta abra su formulario al hacer clic.
 *
 * Idempotente: si un formulario con ese slug ya existe, lo reutiliza en
 * vez de duplicarlo; si una opción de participación ya tiene un
 * formulario asignado, no lo pisa.
 *
 * "Quiero aportar una idea" queda sin formulario a propósito: ya tiene su
 * propio circuito completo en /propuestas (con seguimiento de estado), así
 * que no hace falta un formulario genérico para eso.
 *
 * Uso:
 *   npx tsx scripts/seed-participation-forms.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db, isDbConfigured } = await import("../src/db");
  const { forms, participationOptions } = await import("../src/db/schema");

  if (!isDbConfigured) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  type FieldDef = {
    key: string;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "boolean" | "select" | "email" | "url" | "image";
    required?: boolean;
    options?: string[];
  };

  const equipoOptions = [
    "Desarrollo económico",
    "Estado eficiente",
    "Ciudad",
    "Instituciones",
    "Ambiente",
    "Cultura y educación",
    "Seguridad y convivencia",
    "Otro",
  ];

  const formDefs: {
    optionTitle: string;
    slug: string;
    name: string;
    description: string;
    successMessage: string;
    fields: FieldDef[];
  }[] = [
    {
      optionTitle: "Quiero conocer el espacio",
      slug: "quiero-info",
      name: "Quiero recibir información",
      description: "Dejanos tus datos y te contamos más sobre quiénes somos y qué proponemos.",
      successMessage: "¡Gracias! Te vamos a escribir pronto.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: false },
      ],
    },
    {
      optionTitle: "Quiero asistir a una reunión",
      slug: "inscripcion-reunion",
      name: "Inscripción a reunión",
      description: "Contanos tus datos para anotarte a la próxima reunión abierta.",
      successMessage: "¡Gracias! Te esperamos en la próxima reunión.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: false },
        { key: "barrio", label: "Barrio", type: "text", required: false },
      ],
    },
    {
      optionTitle: "Quiero colaborar",
      slug: "quiero-colaborar",
      name: "Quiero colaborar",
      description: "Contanos cómo te gustaría sumar tu tiempo o tus capacidades.",
      successMessage: "¡Gracias! Nos vamos a poner en contacto con vos.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: false },
        {
          key: "como_colaborar",
          label: "¿Cómo te gustaría colaborar?",
          type: "textarea",
          required: false,
        },
      ],
    },
    {
      optionTitle: "Quiero participar de un equipo temático",
      slug: "equipo-tematico",
      name: "Sumate a un equipo temático",
      description: "Elegí el equipo de trabajo que más te interesa.",
      successMessage: "¡Gracias! Te contactamos para coordinar la primera reunión del equipo.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: false },
        { key: "equipo", label: "Equipo de interés", type: "select", required: true, options: equipoOptions },
      ],
    },
    {
      optionTitle: "Quiero fiscalizar",
      slug: "quiero-fiscalizar",
      name: "Quiero ser fiscal",
      description: "Sumate al cuerpo de fiscales de Alta Gracia Avanza.",
      successMessage: "¡Gracias! Te vamos a contactar con la información para fiscalizar.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "dni", label: "DNI", type: "text", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: false },
        { key: "barrio", label: "Barrio", type: "text", required: false },
        {
          key: "experiencia_previa",
          label: "¿Fiscalizaste en elecciones anteriores?",
          type: "boolean",
          required: false,
        },
      ],
    },
    {
      optionTitle: "Quiero afiliarme",
      slug: "quiero-afiliarme",
      name: "Quiero afiliarme",
      description: "Formalizá tu participación en Alta Gracia Avanza.",
      successMessage: "¡Gracias! Te contactamos para completar el trámite de afiliación.",
      fields: [
        { key: "nombre", label: "Nombre y apellido", type: "text", required: true },
        { key: "dni", label: "DNI", type: "text", required: true },
        { key: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "domicilio", label: "Domicilio", type: "text", required: false },
      ],
    },
  ];

  for (const def of formDefs) {
    const [existingForm] = await db.select().from(forms).where(eq(forms.slug, def.slug));

    let formId: string;
    if (existingForm) {
      formId = existingForm.id;
      console.log(`Formulario "${def.name}" ya existía (${def.slug}), lo reutilizo.`);
    } else {
      const [created] = await db
        .insert(forms)
        .values({
          slug: def.slug,
          name: def.name,
          description: def.description,
          successMessage: def.successMessage,
          fields: def.fields,
        })
        .returning({ id: forms.id });
      formId = created.id;
      console.log(`Formulario "${def.name}" creado (${def.slug}).`);
    }

    const [option] = await db
      .select()
      .from(participationOptions)
      .where(eq(participationOptions.title, def.optionTitle));

    if (!option) {
      console.log(
        `  [AVISO] No encontré la opción de Participá "${def.optionTitle}" — no se asignó el formulario.`
      );
      continue;
    }

    if (option.formId) {
      console.log(`  "${option.title}" ya tenía un formulario asignado, no lo piso.`);
      continue;
    }

    await db.update(participationOptions).set({ formId }).where(eq(participationOptions.id, option.id));
    console.log(`  Asignado a "${option.title}".`);
  }

  console.log(
    '\nListo. "Quiero aportar una idea" quedó sin formulario a propósito: ya tiene su propio circuito en /propuestas.'
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
