export const site = {
  name: "Psico Care", tagline: "Tu bienestar importa.",
  description: "Explora Psico Care: una aplicación en desarrollo para acompañarte con conversaciones guiadas, reflexiones, ejercicios y práctica a tu ritmo.",
  email: "contacto.Psicocare26@gmail.com", phone: "+505 8970-0990", phoneHref: "+50589700990",
};
export const nav = [
  { label: "Producto", href: "/#producto" }, { label: "Funciones", href: "/#funciones" },
  { label: "App móvil", href: "/#app-movil" }, { label: "Encuestas", href: "/encuestas" },
  { label: "Seguridad", href: "/seguridad" }, { label: "Educación", href: "/educacion" },
];
export const modules = [
  { id: "conversation", name: "Conversaciones guiadas", label: "Conversar", icon: "chat", description: "Dale espacio a lo que sientes y organiza tus pensamientos con preguntas sencillas.", example: "Quiero prepararme para mi entrevista de mañana.", action: "Practicar una conversación", status: "Vista previa" },
  { id: "reflection", name: "Diario y reflexiones", label: "Reflexiones", icon: "book", description: "Haz una pausa, pon en palabras tu día y reconoce lo que te llevas de él.", example: "¿Qué me costó hoy y qué quiero intentar mañana?", action: "Escribir una reflexión", status: "Vista previa" },
  { id: "simulation", name: "Simulaciones sociales", label: "Simulaciones", icon: "people", description: "Ensaya una entrevista, cómo pedir ayuda o una conversación que estás posponiendo.", example: "Practicar cómo expresar un límite con respeto.", action: "Explorar una simulación", status: "Vista previa" },
  { id: "gradual", name: "Exposición gradual", label: "Paso a paso", icon: "steps", description: "Divide una situación cotidiana en pequeños pasos y elige por dónde empezar.", example: "De preparar un saludo a presentarme ante un grupo.", action: "Elegir un primer paso", status: "Vista previa" },
  { id: "tools", name: "Herramientas y ejercicios", label: "Herramientas", icon: "wind", description: "Encuentra una pausa en tu día con ejercicios breves de respiración y atención.", example: "Un minuto para bajar el ritmo antes de continuar.", action: "Hacer una pausa", status: "Vista previa" },
  { id: "progress", name: "Tu progreso", label: "Progreso", icon: "chart", description: "Reconoce tus prácticas y lo que has aprendido, sin compararte con otras personas.", example: "Volver a una reflexión y ver qué ha cambiado.", action: "Ver mi recorrido", status: "Vista previa" },
  { id: "survey", name: "Encuestas", label: "Encuestas", icon: "survey", description: "Ayúdanos a decidir qué construir con preguntas sobre lo que esperas del producto.", example: "Elegir las funciones que realmente usarías.", action: "Conocer la encuesta", status: "Disponible en la web" },
  { id: "human", name: "Conexión humana", label: "Apoyo humano", icon: "heart", description: "Reconoce cuándo quieres dar el siguiente paso con alguien de confianza o un profesional.", example: "Preparar cómo pedir ayuda a una persona de confianza.", action: "Explorar el siguiente paso", status: "Red profesional en desarrollo" },
] as const;
export type ModuleId = (typeof modules)[number]["id"];

/** The core promise: the product is free for people; institutions buy the layer around it. */
export const FREE_PROMISE = "Psico Care es gratuito para las personas. Las instituciones incorporan herramientas para acompañar mejor a sus comunidades.";
export const PRIVACY_PROMISE = "La institución mide el programa. La experiencia personal sigue siendo privada.";
export const PRICING_NOTE = "Todavía no publicamos precios cerrados. Definimos cada programa según el tamaño de la comunidad, la duración y el alcance, y lo dejamos por escrito antes de comprometer nada.";
export const DEVELOPMENT_NOTE = "Psico Care está en desarrollo y buscamos instituciones pioneras para la fase de validación. Las funciones institucionales descritas aquí forman parte del diseño del programa y se acuerdan por escrito antes de cualquier implementación.";

/** Everything a young person gets without paying and without belonging to an institution. */
export const personalExperience = [
  "Conversaciones guiadas", "Reflexiones y diario emocional", "Ejercicios y herramientas",
  "Simulaciones sociales", "Exposición gradual", "Seguimiento personal",
  "Encuestas públicas", "Recursos de bienestar", "Acceso a opciones de ayuda humana",
] as const;

/** What the institution adds on top. None of this reaches a student's private experience. */
export const institutionalLayer = [
  "Panel institucional", "Programas por grupos o cohortes", "Encuestas propias",
  "Analítica agregada", "Métricas de adopción", "Informes institucionales",
  "Recursos propios de bienestar", "Rutas institucionales de apoyo",
  "Gestión de campañas", "Configuración institucional", "Soporte de implementación",
] as const;
export const advancedLayer = [
  "Inicio de sesión institucional (SSO)", "Integraciones con sistemas propios", "API",
  "Despliegue multicampus", "Implementación a medida", "Soporte prioritario acordado",
] as const;

export const educationMoments = [
  { id: "start", icon: "steps", title: "Inicio de curso", body: "Recursos y actividades para adaptarse a un entorno académico nuevo, conocer el espacio y empezar con orden." },
  { id: "exams", icon: "clock", title: "Semana de exámenes", body: "Ejercicios de regulación, organización del tiempo e iniciativas de bienestar en los periodos de mayor carga." },
  { id: "first-year", icon: "people", title: "Primer año universitario", body: "Programas estructurados para estudiantes que están adaptándose a la vida universitaria." },
  { id: "career", icon: "chat", title: "Preparación profesional", body: "Simulaciones de entrevista, práctica de comunicación y preparación para procesos de empleo." },
  { id: "social", icon: "heart", title: "Habilidades sociales", body: "Practicar conversaciones difíciles y situaciones cotidianas antes de enfrentarlas." },
  { id: "wellbeing", icon: "survey", title: "Bienestar estudiantil", body: "Campañas institucionales, encuestas y acceso a los recursos oficiales de apoyo de la institución." },
] as const;

/** Illustrative only — the figures below are labelled as an example in the interface. */
export const programExample = {
  name: "Semana de bienestar académico",
  duration: "4 semanas",
  audience: "Estudiantes de primer año",
  activities: ["Ejercicio de respiración", "Reflexión semanal", "Simulación de conversación", "Encuesta de experiencia"],
  metrics: ["Invitaciones enviadas", "Activaciones", "Participación", "Actividades completadas", "Encuestas respondidas", "Módulos utilizados", "Adopción sostenida"],
} as const;

export const institutionalPlans = [
  {
    id: "pilot", name: "Piloto de validación", price: "Sin costo", unit: "durante la fase de validación",
    summary: "Evaluar Psico Care con una comunidad educativa definida antes de una implementación mayor.",
    highlight: false, cta: "Solicitar piloto",
    note: "Programa limitado de validación, no un servicio institucional gratuito permanente.",
    includes: ["Hasta 100 participantes", "Duración acordada de 2 a 3 meses", "Encuesta inicial y final", "Métricas agregadas", "Informe de cierre", "Acompañamiento de implementación"],
  },
  {
    id: "education", name: "Psico Care Educación", price: "Planes según el tamaño", unit: "de la comunidad educativa",
    summary: "Para universidades y centros educativos que quieren incorporar Psico Care como parte de sus iniciativas de bienestar.",
    highlight: true, cta: "Conocer Psico Care Educación",
    note: "El alcance y las condiciones se definen por escrito antes de cualquier compromiso.",
    includes: ["Acceso para la comunidad definida", "Panel institucional", "Programas y cohortes", "Encuestas institucionales", "Métricas agregadas", "Informes periódicos", "Recursos propios de bienestar", "Soporte de implementación"],
  },
  {
    id: "custom", name: "Programa a medida", price: "A convenir", unit: "según alcance y duración",
    summary: "Para redes educativas, universidades multicampus, ONG y programas públicos de mayor escala.",
    highlight: false, cta: "Hablar sobre el proyecto",
    note: "Pensado para iniciativas que abarcan varias sedes o instituciones.",
    includes: ["Todo lo del programa institucional", "Implementación a medida", "Integraciones institucionales", "Programas adaptados", "Estructura multisede", "Capacitación del equipo", "Informes propios", "SSO y API cuando aplique"],
  },
] as const;

export const collaborationTracks = [
  { id: "research", title: "Investigación conjunta", body: "Trabajamos con facultades, investigadores y especialistas para validar instrumentos, contenidos y experiencias. Compartimos los hallazgos agregados.", cta: "Proponer colaboración" },
  { id: "alliance", title: "Convenios y alianzas", body: "Colaboramos con organizaciones que quieran ampliar el acceso, impulsar investigación o apoyar programas de bienestar juvenil, sin intercambio económico.", cta: "Explorar una alianza" },
] as const;

export const institutionalProcess = [
  { step: "01", title: "Conversación inicial", body: "Nos cuentas tu contexto, tu población y qué necesitas resolver. Sin compromiso." },
  { step: "02", title: "Propuesta de alcance", body: "Definimos modalidad, número de personas, duración y qué se medirá." },
  { step: "03", title: "Acuerdo y puesta en marcha", body: "Firmamos las condiciones, incluido el tratamiento de datos, y preparamos el acceso." },
  { step: "04", title: "Acompañamiento y revisión", body: "Revisamos resultados agregados de forma periódica y ajustamos lo que haga falta." },
] as const;

/** Contact form vocabularies, shared by the form and the server-side schema. */
export const CONTACT_TYPES = ["Universidad", "Colegio", "Instituto técnico", "ONG o fundación", "Programa juvenil", "Estudiante o usuario", "Otra"] as const;
export const CONTACT_SIZES = ["Menos de 250", "250 a 1,000", "1,000 a 5,000", "Más de 5,000", "No aplica"] as const;
export const CONTACT_INTERESTS = ["Piloto", "Programa institucional", "Investigación", "Alianza", "Otro"] as const;
