# PsicoCare

Web de producto en español con una demo interactiva de la experiencia móvil, encuestas persistentes y un panel privado de investigación. La aplicación móvil completa y los servicios de IA y conexión profesional continúan en desarrollo. La demo utiliza conversaciones preparadas y no envía reflexiones ni emociones a servidores.

## Ejecución local

Requiere **Node 24.14 o superior dentro de la rama 24**, npm y un disco local escribible. Conserva Next.js 15 App Router, React 19, TypeScript y Tailwind 4. SQLite utiliza el módulo integrado de Node, sin otro servidor de base de datos ni ORM.

```sh
npm ci
npm run db:setup
npm run dev
```

Abre http://localhost:3000. No hace falta una credencial para la demo ni para las encuestas locales. La configuración opcional se describe en [.env.example](.env.example); cópiala a `.env.local` para habilitar el acceso interno o personalizar el almacenamiento.

## Variables

| Nombre | Uso |
| --- | --- |
| DATABASE_PATH | Ruta al archivo SQLite. En desarrollo: `data/psicocare.sqlite`. Obligatoria en producción; usar volumen persistente. |
| SITE_URL | Origen de la web para proteger peticiones y resolver metadata. Usar el origen público HTTPS real antes de compilar y desplegar. |
| ADMIN_PASSWORD | Clave privada de equipo, mínimo 16 caracteres. Sin un valor válido, el panel permanece cerrado. |
| ADMIN_SESSION_SECRET | Secreto aleatorio independiente, mínimo 32 caracteres, para firmar sesiones internas de ocho horas. Rotarlo revoca las sesiones existentes. |

Nunca uses el prefijo `NEXT_PUBLIC_` para estas variables ni subas secretos al repositorio. La configuración de pruebas genera sus propias credenciales efímeras y no usa credenciales de producción.

## Rutas

- `/`: producto, demo, módulos, encuesta, seguridad, instituciones, misión y contacto.
- `/encuestas`: encuesta inicial de producto.
- `/encuestas/construyamos-psicocare`: acceso por slug; el motor permite encuestas adicionales.
- `/seguridad`, `/privacidad`, `/nosotros`, `/tecnologia`: información secundaria.
- `/admin/encuestas`: acceso interno, agregados reales y buzón de contactos. Protegido en servidor.

No hay registro de usuarios, servicios de IA, descarga de una app publicada, agenda clínica ni integración de correo. El formulario de contacto guarda un mensaje real en el buzón del equipo; no envía un email. El equipo debe revisar ese buzón.

## Persistencia y migraciones

La migración [001_surveys.sql](lib/database/migrations/001_surveys.sql) crea:

- `surveys`, `survey_questions`, `survey_options`: definición versionada.
- `survey_responses`: inicio, consentimiento, versión, finalización y hash del identificador aleatorio.
- `survey_answers`: valores de respuesta por pregunta; las selecciones múltiples se almacenan como un array JSON validado.
- `contact_leads`: buzón independiente, con autorización propia.
- `rate_limits`: contadores temporales persistentes con claves opacas.

```sh
npm run db:migrate
npm run db:seed
npm run db:purge
```

`db:setup` ejecuta migración y seed. Ambos son idempotentes; el seed solo crea la definición de la encuesta, nunca participantes ni métricas. El historial se conserva en `schema_migrations`. No se ejecutan migraciones durante una petición pública ni en el build.

Para añadir o cambiar una encuesta publicada, crear una nueva definición/version con identificadores propios y una migración/seed revisada. No editar preguntas que ya tienen respuestas: el servidor comprueba la versión de cada participación. El campo `status` y las ventanas `starts_at`/`ends_at` controlan su disponibilidad.

El motor admite selección única, selección múltiple, Likert, puntuaciones 0–10 y 1–5, sí/no y texto opcional breve. El endpoint resuelve la definición desde la base de datos y valida cada pregunta y opción.

## Consentimiento y privacidad

La encuesta inicial está restringida a mayores de 18 años. Exige consentimiento explícito antes de crear una participación; seleccionar posteriormente un rango menor de edad elimina la participación iniciada. No es un control de identidad ni una verificación documental de edad. Abrir investigaciones con menores requiere un proceso específico revisado.

Al avanzar o volver se guardan las respuestas de forma transaccional. Una cookie necesaria HttpOnly reconoce la participación en el mismo navegador, sin almacenar respuestas en localStorage. El servidor solo guarda el hash del identificador aleatorio. La restricción única por encuesta e identificador y el envío idempotente evitan duplicados accidentales; no garantizan que una persona no use otro navegador.

La persona puede retirar su participación, incluidos los datos enviados, desde la encuesta y el mismo navegador. No hay vinculación entre participación y contacto. No se guardan IP ni agente de usuario. Los campos abiertos advierten que no se introduzcan datos sensibles. Los logs de infraestructura y las copias de seguridad requieren su propia configuración por parte del operador.

Los borradores caducan tras 7 días sin actividad; respuestas completas y contactos tras 180 días. La base de datos aplica la limpieza al acceder, como máximo una vez por hora. Programar `db:purge` diariamente también permite limpiar una instancia sin tráfico. Configurar la misma retención en backups.

## Seguridad

- Validación con Zod del cuerpo y validación contra preguntas/opciones en base de datos.
- Consultas preparadas, claves foráneas, transacciones, WAL y espera de bloqueo.
- Límite de cuerpo por streaming, texto limitado, rechazo de campos desconocidos.
- Comprobación del origen en todas las mutaciones, sin CORS público.
- Límites globales y por participación; el contacto tiene un límite adicional por hash del correo y un campo señuelo.
- Acceso administrativo con comparación de tiempo constante, cookie firmada, HttpOnly, SameSite Strict, Secure en producción y expiración de ocho horas.
- El panel y sus datos se resuelven en servidor después de autorizar. No se serializan datos privados para visitantes sin sesión.
- Cabeceras contra incrustación, detección de MIME y acceso a cámara/micrófono/localización.

La protección contra abuso es una base apropiada para una instancia pequeña: no constituye una defensa contra ataques distribuidos ni una verificación de persona. Antes de escalar, añadir controles en el proxy de entrada según el tráfico real. El login es una clave de equipo, no un sistema de cuentas individuales o auditoría multiusuario.

## Analítica

El panel calcula participaciones iniciadas, respuestas completas y tasa de finalización sobre registros reales. Desde cinco respuestas completas muestra disposición media, recomendación media, distribuciones de todas las preguntas cerradas salvo edad y tendencia diaria en UTC. Las preguntas múltiples pueden sumar más del total de participantes. Los promedios se calculan solo con respuestas numéricas completas.

No hay segmentaciones por edad, texto libre de encuesta ni datos de encuesta públicos. El panel presenta estados vacíos reales. Los textos abiertos se conservan en SQLite para una revisión controlada fuera del panel cuando proceda. El buzón interno muestra los últimos 100 contactos.

## Marca y estructura

Los recursos de [public/brand](public/brand) proceden del manual de marca facilitado. Ver [procedencia](public/brand/README.md). Montserrat y Lora se sirven localmente mediante Fontsource; no se solicitan fuentes de terceros al cargar la web.

```text
app/                   Rutas, metadata y endpoints
components/layout/     Navegación, pie y páginas informativas
components/sections/   Secciones de producto
components/product-demo/ Demo y marco de teléfono reutilizable
components/surveys/    Consentimiento, cuestionario y campos por tipo
components/admin/      Entrada/salida del panel
lib/content.ts         Datos de módulos y navegación
lib/database/          Conexión y migraciones SQLite
lib/surveys/           Modelo, definición, validación, repositorio y analítica
lib/server/            Sesiones, límites y seguridad HTTP
scripts/               Migración, seed, retención y servidor de pruebas
tests/                 Pruebas de datos, seguridad y navegador
```

## Comprobaciones

```sh
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

Las pruebas de datos usan archivos temporales. Las de navegador crean una base independiente en `.verification`, claves aleatorias y un servidor local en el puerto 3100. No escriben datos de prueba en `data/psicocare.sqlite`. Las capturas quedan en `.verification/home-390.png` y `.verification/home-1440.png`; los archivos de prueba y las bases locales están excluidos de Git.

## Despliegue

Compilar con el `SITE_URL` real y ejecutar el mismo proyecto con `npm run start` en Node 24. Configurar el volumen SQLite, las variables privadas, HTTPS, permisos del archivo y backups antes de recoger respuestas públicas. Ejecutar migraciones sobre el destino con un respaldo verificado, según el procedimiento del operador.

SQLite necesita **un servidor/una instancia con disco persistente**. No desplegar este almacenamiento en un filesystem efímero o compartido entre réplicas sin revisar la arquitectura. Para múltiples instancias, migrar el repositorio de datos a una base relacional gestionada preservando el modelo y los contratos de la API.

Antes de una apertura pública, concretar identidad del responsable de datos, canal de solicitudes, alojamiento, retención de backups y revisión profesional del contenido. La aplicación móvil completa, IA, protocolos clínicos y red profesional son desarrollo posterior.

## Comandos del equipo

Sin servicio de correo no hay recuperación de contraseña desde la web, así que se gestiona por línea de comandos contra la base de producción:

```powershell
$env:DATABASE_URL="<cadena DATABASE_URL_UNPOOLED de Neon>"

npm run team:list                       # cuentas existentes
npm run team:bootstrap -- correo "Nombre"   # primera cuenta (solo si no hay ninguna)
npm run team:password -- correo         # restablecer una contraseña perdida

Remove-Item Env:DATABASE_URL
```

`team:password` genera una contraseña nueva, cierra las sesiones abiertas de esa cuenta y obliga a cambiarla al entrar.
