/**
 * Fuente única de verdad para todo el texto de la landing.
 * Editar aquí evita tocar los componentes.
 *
 * Regla del proyecto: nada de métricas, testimonios, alianzas o resultados
 * clínicos inventados. Todo lo que describe capacidades futuras se enuncia
 * explícitamente como propuesta.
 */

export const site = {
  name: "PsicoCare",
  tagline: "Tecnología que escucha. Inteligencia que sabe sus límites.",
  event: "Hackathon Nicaragua 2026",
  description:
    "PsicoCare es una plataforma de inteligencia artificial especializada en psicología, creada para acompañar, entrenar y orientar a jóvenes de forma responsable, humana y segura.",
} as const;

export const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "El problema", href: "#problema" },
  { label: "La solución", href: "#idea" },
  { label: "Capacidades", href: "#capacidades" },
  { label: "Tecnología", href: "#tecnologia" },
  { label: "Seguridad", href: "#seguridad" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Impacto", href: "#impacto" },
] as const;

export const hero = {
  badge: "Propuesta para Hackathon Nicaragua 2026",
  titleLead: "La inteligencia artificial",
  titleAccent: "también puede aprender a escuchar mejor.",
  subtitle: site.description,
  primaryCta: { label: "Conoce PsicoCare", href: "#idea" },
  secondaryCta: { label: "Cómo funciona", href: "#tecnologia" },
  disclaimer:
    "PsicoCare no diagnostica ni sustituye a un profesional de la salud mental. Es una capa de acompañamiento y entrenamiento que escala hacia ayuda humana.",
  pillars: ["IA especializada", "Psicología", "Jóvenes", "Seguridad"],
};

export const problem = {
  eyebrow: "01 — El problema",
  title: "¿Qué ocurre cuando una IA generalista se convierte en tu confidente?",
  lede: "Millones de jóvenes ya usan asistentes comerciales para hablar de ansiedad, presión académica, relaciones o entrevistas. No porque esas herramientas hayan sido diseñadas para eso, sino porque están disponibles a cualquier hora y no juzgan.",
  generalPurpose: {
    label: "IA de propósito general",
    caption: "Excelente en muchas tareas a la vez",
    items: [
      "Responde preguntas",
      "Genera contenido",
      "Ayuda a programar",
      "Resume información",
      "Traduce y redacta",
      "Conversa",
    ],
  },
  gap: {
    label: "Lo que no fue diseñado para este contexto",
    items: [
      {
        title: "Sin protocolo psicológico de base",
        body: "La conversación no se estructura alrededor de principios de acompañamiento ni de un marco terapéutico.",
      },
      {
        title: "Sin continuidad del proceso",
        body: "Cada sesión empieza casi de cero: no hay una noción de progreso ni de práctica gradual.",
      },
      {
        title: "Sin una ruta hacia lo humano",
        body: "Cuando la conversación excede lo que una máquina debería sostener, no existe un camino claro hacia apoyo profesional.",
      },
    ],
  },
  question: "¿Y si diseñáramos una IA pensando específicamente en el contexto psicológico desde el principio?",
  transition: { from: "IA para todo", to: "IA diseñada para acompañar mejor" },
};

export const idea = {
  eyebrow: "02 — La idea",
  title: "No queremos crear otra IA. Queremos crear una IA que sepa cuándo no basta.",
  lede: "Una IA puede sostener una conversación, guiar un ejercicio o ayudar a practicar una situación difícil. Pero hay momentos en los que una máquina no debería intentar resolverlo todo. Ese límite es el centro del diseño de PsicoCare, no una nota al pie.",
  quote: "La IA puede acompañar. El profesional puede intervenir.",
  flow: [
    {
      step: "01",
      title: "Usuario",
      body: "Una conversación, una simulación o un ejercicio de reflexión.",
    },
    {
      step: "02",
      title: "IA especializada",
      body: "Un modelo orientado al dominio psicológico, con protocolos de conversación definidos.",
    },
    {
      step: "03",
      title: "Evaluación de contexto y señales",
      body: "El sistema revisa indicadores conversacionales relevantes. No emite diagnósticos.",
    },
    {
      step: "04",
      title: "Nivel de atención",
      body: "Según el contexto, la respuesta se ajusta y puede cambiar de modo.",
    },
    {
      step: "05",
      title: "Sugerencia de apoyo profesional",
      body: "Si corresponde, el sistema propone dar el siguiente paso con una persona.",
    },
    {
      step: "06",
      title: "Contacto con consentimiento",
      body: "El escalamiento solo avanza si el usuario lo autoriza de forma explícita.",
    },
  ],
};

export type Capability = {
  id: string;
  index: string;
  name: string;
  headline: string;
  body: string;
  detailLabel: string;
  details: string[];
  note?: string;
};

export const capabilities: Capability[] = [
  {
    id: "conversaciones",
    index: "01",
    name: "Conversaciones especializadas",
    headline: "Una conversación diseñada, no improvisada",
    body: "Diálogos construidos alrededor de principios psicológicos y protocolos de seguridad, con un tono estable y una idea clara de hasta dónde debe llegar la máquina.",
    detailLabel: "Principios de diseño",
    details: [
      "Escucha estructurada antes de sugerir",
      "Lenguaje no clínico y sin etiquetas",
      "Protocolos definidos para temas sensibles",
      "Trazabilidad de por qué respondió así",
    ],
  },
  {
    id: "entrevistas",
    index: "02",
    name: "Simulación de entrevistas",
    headline: "Practica antes de que sea real",
    body: "El usuario ensaya entrevistas laborales, académicas u otras situaciones importantes. La IA adopta distintos perfiles y devuelve observaciones sobre el desempeño comunicativo.",
    detailLabel: "Perfiles del entrevistador",
    details: [
      "Entrevistador amable",
      "Entrevistador exigente",
      "Entrevistador impredecible",
      "Audiencia crítica",
    ],
    note: "El feedback cubre claridad, comunicación, manejo de presión, estructura de las respuestas y confianza percibida. Son observaciones sobre la práctica, no medidas psicológicas.",
  },
  {
    id: "sociales",
    index: "03",
    name: "Situaciones sociales",
    headline: "Ensaya la conversación que estás evitando",
    body: "Un espacio para practicar los momentos que cuestan: los que se posponen durante semanas y terminan pesando más que la conversación misma.",
    detailLabel: "Escenarios disponibles",
    details: [
      "Hablar frente a un grupo",
      "Defender una idea",
      "Responder preguntas difíciles",
      "Resolver un conflicto",
      "Pedir ayuda",
      "Establecer límites",
    ],
  },
  {
    id: "exposicion",
    index: "04",
    name: "Exposición progresiva",
    headline: "De a poco, y a tu ritmo",
    body: "Un sistema de niveles para que la dificultad suba de forma gradual y elegida por el usuario, en lugar de enfrentarlo de golpe a la situación completa.",
    detailLabel: "Niveles",
    details: [
      "Nivel 1 · Conversación sencilla",
      "Nivel 2 · Preguntas ligeramente incómodas",
      "Nivel 3 · Situación con presión",
      "Nivel 4 · Audiencia",
      "Nivel 5 · Situación compleja",
    ],
  },
  {
    id: "reflexion",
    index: "05",
    name: "Reflexión personal",
    headline: "Lo importante suele pasar después",
    body: "Terminada una conversación o simulación, PsicoCare acompaña un cierre breve para ordenar lo que ocurrió y convertirlo en algo aplicable.",
    detailLabel: "Preguntas de cierre",
    details: [
      "¿Qué sentiste?",
      "¿Qué pensaste en ese momento?",
      "¿Qué te resultó difícil?",
      "¿Qué aprendiste?",
      "¿Qué podrías intentar la próxima vez?",
    ],
  },
  {
    id: "deteccion",
    index: "06",
    name: "Detección temprana",
    headline: "Un sistema que presta atención al contexto",
    body: "PsicoCare contempla el análisis de patrones conversacionales y señales relevantes para determinar si una situación podría requerir mayor atención.",
    detailLabel: "Qué observa el sistema",
    details: [
      "Señales conversacionales del contexto",
      "Cambios sostenidos en el tono del diálogo",
      "Indicadores que sugieren necesidad de apoyo",
      "Nivel de atención recomendado",
    ],
    note: "No es un diagnóstico ni una medición clínica. Es una señal interna que ajusta cómo responde el sistema y cuándo sugerir ayuda humana.",
  },
  {
    id: "conexion",
    index: "07",
    name: "Conexión humana",
    headline: "El paso que la IA no debe dar sola",
    body: "En una etapa futura, si el sistema identifica señales preocupantes, puede preguntar al usuario si desea recibir ayuda profesional. El contacto solo se inicia con su autorización explícita.",
    detailLabel: "Secuencia de escalamiento",
    details: [
      "IA identifica señales",
      "Usuario recibe la sugerencia",
      "Usuario otorga consentimiento",
      "Contacto con profesional certificado",
    ],
    note: "Nunca IA → profesional de forma automática. El usuario siempre está en medio de la decisión.",
  },
];

export const difference = {
  eyebrow: "04 — La diferencia",
  title: "El mismo motor, un propósito distinto",
  lede: "Las IA generalistas son excelentes herramientas. PsicoCare propone explorar qué sucede cuando una IA se diseña específicamente alrededor de un dominio tan sensible como la psicología.",
  general: {
    label: "IA de propósito general",
    sub: "ChatGPT · Gemini · Claude · entre otras",
    points: [
      "Diseñadas para resolver tareas de todo tipo",
      "Optimizadas para amplitud de conocimiento",
      "La conversación emocional es un uso más",
      "Sin capa específica de escalamiento humano",
      "Sin un recorrido de práctica por niveles",
    ],
  },
  psicocare: {
    label: "PsicoCare",
    sub: "Diseñada alrededor de un solo dominio",
    points: [
      "Construida para el contexto psicológico",
      "Acompañamiento con protocolos definidos",
      "Simulación y entrenamiento como núcleo",
      "Safety layer y detección temprana integradas",
      "Escalamiento humano con consentimiento",
    ],
  },
  closing:
    "No se trata de competir con modelos generalistas, sino de preguntarnos qué cambia cuando el dominio se decide desde el primer día.",
};

export const technology = {
  eyebrow: "05 — Nuestra tecnología",
  title: "Nuestra arquitectura propuesta",
  lede: "PsicoCare contempla partir de un modelo open-weight y especializarlo mediante fine-tuning, RAG sobre una base de conocimiento psicológico, evaluación continua y capas de seguridad. El sistema está en desarrollo: lo que sigue describe el diseño que proponemos, no una implementación terminada.",
  layers: [
    { id: "usuario", label: "Usuario", detail: "Punto de entrada de toda interacción" },
    { id: "interfaz", label: "Interfaz PsicoCare", detail: "Web y móvil, con estados de conversación y simulación" },
    { id: "orquestador", label: "Orquestador de IA", detail: "Decide modo, contexto y ruta de la petición" },
    { id: "modelo", label: "Modelo especializado", detail: "Modelo open-weight ajustado al dominio psicológico" },
    { id: "kb", label: "Base de conocimiento psicológico", detail: "Recuperación de material de referencia validado (RAG)" },
    { id: "safety", label: "Safety Layer", detail: "Reglas, límites y verificación de la respuesta" },
    { id: "risk", label: "Risk Detection", detail: "Señales de contexto y nivel de atención sugerido" },
    { id: "salida", label: "Respuesta · Simulación · Escalamiento", detail: "Resultado que recibe el usuario" },
  ],
  stack: [
    { name: "Modelo base open-weight", note: "Punto de partida auditable y adaptable" },
    { name: "Fine-tuning de dominio", note: "Especialización en el contexto psicológico" },
    { name: "RAG", note: "Respuestas ancladas en material de referencia" },
    { name: "Evaluación continua", note: "Casos de prueba y revisión de comportamiento" },
    { name: "Capas de seguridad", note: "Límites explícitos y rutas de escalamiento" },
  ],
};

export const safety = {
  eyebrow: "06 — Seguridad",
  title: "Una IA para psicología necesita saber sus límites.",
  lede: "La seguridad no es una función añadida al final. Es la condición que hace posible todo lo demás.",
  quote:
    "La inteligencia no está solo en responder. También está en reconocer cuándo debe pedir ayuda.",
  principles: [
    { title: "Privacidad", body: "La información sensible se trata como lo que es." },
    { title: "Consentimiento", body: "Ningún paso hacia un tercero ocurre sin autorización." },
    { title: "Minimización de datos", body: "Solo lo necesario para que la experiencia funcione." },
    { title: "Transparencia", body: "El usuario entiende qué es el sistema y qué no es." },
    { title: "Supervisión humana", body: "Personas revisando el comportamiento del sistema." },
    { title: "Detección de riesgo", body: "Señales de contexto que ajustan la respuesta." },
    { title: "Escalamiento", body: "Una ruta clara hacia el apoyo profesional." },
    { title: "No diagnóstico", body: "PsicoCare no clasifica ni etiqueta condiciones." },
    { title: "No sustitución", body: "El profesional sigue siendo irremplazable." },
  ],
  pipeline: [
    { label: "Conversación", detail: "El usuario escribe o habla con el sistema." },
    { label: "Análisis de contexto", detail: "Se interpreta la situación, no a la persona." },
    { label: "Evaluación de riesgo", detail: "Se estima el nivel de atención necesario." },
    { label: "Respuesta segura", detail: "El sistema responde dentro de sus límites." },
    { label: "Apoyo humano", detail: "Si es necesario, se propone dar el paso.", terminal: true },
  ],
};

export const roadmap = {
  eyebrow: "07 — Roadmap",
  title: "De una idea en un hackathon a una plataforma real",
  lede: "Todas las fases posteriores a la actual describen trabajo planificado, no implementado.",
  phases: [
    {
      phase: "Fase 01",
      name: "Concepto",
      body: "PsicoCare nace en Hackathon Nicaragua 2026: la propuesta, la arquitectura y los principios de seguridad.",
      status: "En curso" as const,
    },
    {
      phase: "Fase 02",
      name: "Prototipo",
      body: "Primer modelo especializado y primeras experiencias conversacionales funcionando de extremo a extremo.",
      status: "Planificado" as const,
    },
    {
      phase: "Fase 03",
      name: "Validación",
      body: "Evaluación con especialistas y pruebas controladas para revisar el comportamiento del sistema.",
      status: "Planificado" as const,
    },
    {
      phase: "Fase 04",
      name: "Plataforma",
      body: "Aplicación completa para jóvenes, con simulaciones, niveles y espacios de reflexión.",
      status: "Planificado" as const,
    },
    {
      phase: "Fase 05",
      name: "Red profesional",
      body: "Integración de psicólogos y profesionales certificados dentro del flujo de escalamiento.",
      status: "Planificado" as const,
    },
    {
      phase: "Fase 06",
      name: "Escala",
      body: "Expansión regional y adaptación a diferentes contextos culturales y lingüísticos.",
      status: "Planificado" as const,
    },
  ],
};

export const mission = {
  eyebrow: "08 — Nuestra misión",
  title: "Nuestra misión",
  body: "Hacer que los jóvenes tengan acceso a una primera capa de acompañamiento tecnológico responsable, accesible y humana, utilizando inteligencia artificial especializada sin reemplazar el valor irremplazable del acompañamiento profesional.",
  support:
    "Diseñamos la tecnología pensando primero en la persona. Todo lo demás viene después.",
};

export const vision = {
  eyebrow: "09 — Nuestra visión",
  title: "Nuestra visión",
  body: "Crear un futuro donde pedir orientación, practicar una conversación difícil o buscar apoyo no dependa de sentirse completamente preparado para hacerlo.",
  bridgeFrom: "Sentirse solo",
  bridgeTo: "Pedir ayuda",
  bridgeCaption:
    "PsicoCare quiere convertirse en un puente: entre sentirse solo y pedir ayuda.",
};

export const impact = {
  eyebrow: "10 — Impacto",
  title: "Tecnología con un propósito humano",
  lede: "Hackathon Nicaragua 2026 promueve soluciones tecnológicas con impacto humano. PsicoCare busca encajar precisamente en esa intersección.",
  axes: [
    { label: "Tecnología", detail: "IA especializada y arquitectura con capas de seguridad." },
    { label: "Salud", detail: "Bienestar psicológico como dominio de diseño, no como tema secundario." },
    { label: "Juventud", detail: "Pensado para quienes ya conversan con IA sobre lo que les pasa." },
    { label: "IA", detail: "Modelos open-weight especializados en un dominio sensible." },
    { label: "Impacto social", detail: "Una primera capa de acompañamiento accesible." },
  ],
  why: {
    title: "Por qué este proyecto importa",
    body: "El acceso a acompañamiento psicológico sigue siendo desigual, y mientras tanto las conversaciones más difíciles ya están ocurriendo con máquinas que no fueron diseñadas para sostenerlas. PsicoCare no propone reemplazar a nadie: propone que esa primera conversación esté mejor diseñada y sepa hacia dónde derivar.",
  },
};

export const finalCta = {
  title: "La tecnología puede responder una pregunta.",
  subtitle: "PsicoCare quiere ayudar a las personas a encontrar el siguiente paso.",
  primary: { label: "Conoce nuestra visión", href: "#vision" },
  secondary: { label: "Sé parte del futuro de PsicoCare", href: "#roadmap" },
};

export const footer = {
  tagline: site.tagline,
  disclaimer:
    "PsicoCare es una propuesta en desarrollo. No brinda diagnósticos, no sustituye la atención de un profesional de la salud mental y no constituye un servicio de emergencia. Ante una situación de riesgo inmediato, contacta a los servicios de emergencia de tu localidad.",
  event: site.event,
};
