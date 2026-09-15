# Cambios

## 2026-09-14 — Analítica de audiencia

- Se incorpora la analítica web de Vercel en las páginas públicas.
- El panel interno no carga el script, y los parámetros y fragmentos de la dirección se eliminan antes de enviar nada, de modo que marcas del recorrido como `?correo=ok` no salen del sitio.
- Se corrige la página de privacidad, que afirmaba que no se usaba analítica alguna. Ahora describe qué se mide, que incluye un identificador técnico del dispositivo y que no se cruza con encuestas ni contactos.


## 2026-09-14 — Recuperación de contraseñas del equipo

- Se añaden `npm run team:list` y `npm run team:password`. Sin servicio de correo no había ninguna forma de recuperar una contraseña perdida: la cuenta quedaba inaccesible para siempre.
- Restablecer una contraseña cierra todas las sesiones abiertas de esa cuenta y obliga a cambiarla en el siguiente acceso.


## 2026-09-14 — La marca pasa a «Psico Care»

- Se escribe la marca como «Psico Care», en dos palabras, en los 100 textos visibles del sitio. No se tocan el correo de contacto, el identificador de la encuesta ni los nombres de infraestructura, que van en minúscula y romperían enlaces o datos ya guardados.
- En los titulares la marca lleva espacio duro, de modo que «Psico» y «Care» nunca quedan en líneas distintas.
- El eslogan de la demo pasa a «Así funciona Psico Care, de principio a fin», para no repetir «paso a paso», que es también el nombre de un módulo mostrado justo debajo.
- Se resiembra la encuesta para que su título guardado use la marca nueva.
- El build local de verificación puede usar `NEXT_DIST_DIR`, así que compilar ya no invalida el servidor de desarrollo en marcha.


## 2026-09-14 — Correcciones de texto y de saltos de línea en móvil

- Se corrige la causa de las palabras pegadas en móvil: tres reglas ocultaban los `<br>` en pantallas pequeñas sin dejar separación, de modo que «sustituye» y «la atención» se unían. Ahora todos los saltos llevan un espacio delante, así que ocultarlos es seguro.
- Se cambia el eslogan de la demo, que se prestaba a doble lectura, por «Así funciona PsicoCare, paso a paso».
- La suite e2e compila en `.next-e2e`, de modo que ya no invalida el build del servidor de desarrollo al ejecutarse.
- Se corrige un texto que había quedado falso en la sección de seguridad: la encuesta sí ofrece un correo opcional al final.
- Se unifica el tratamiento en la página de educación, que mezclaba «tú» y «ustedes».
- Se escriben «multicampus» y «multisede» sin guion, según la norma para prefijos.
- El verificador de despliegue ya distingue entre «falta DATABASE_URL» y «faltan las migraciones», que requieren soluciones distintas.


## 2026-09-14 — PostgreSQL, cuentas por persona y tabla de respuestas

- Se migra el almacenamiento de SQLite a PostgreSQL para poder desplegar en Vercel, donde el sistema de archivos es efímero. Toda la capa de datos pasa a ser asíncrona con `pg` y un pool por instancia.
- Se unifican las migraciones en `001_initial.sql`, ahora en SQL de PostgreSQL, con `JSONB` para las respuestas y claves foráneas en cascada.
- Se sustituye la clave compartida del panel por cuentas individuales. Cada persona del equipo entra con su correo y su contraseña; todas las cuentas tienen los mismos permisos, incluida la gestión del equipo.
- Las contraseñas se guardan con `scrypt` y sal por contraseña, sin dependencias nativas. Las sesiones viven en la base de datos, de modo que desactivar una cuenta corta su acceso de inmediato.
- Se añade gestión de equipo en el panel: alta de cuentas, desactivación, reactivación y cambio de la propia contraseña. Quien recibe una contraseña asignada debe cambiarla.
- La primera cuenta se crea con `npm run team:bootstrap -- correo "Nombre"`; el resto se gestiona desde el panel.
- Se rehace la lista de respuestas como tabla con cabecera fija, buscador, filtro por correo, selector de columnas, exportación a CSV y panel de detalle. Sustituye a las tarjetas desplegables anteriores.
- El sitio degrada con elegancia si falta `DATABASE_URL`: las páginas públicas siguen siendo estáticas y solo la encuesta y el panel avisan de que falta configuración.
- Las pruebas se ejecutan contra un PostgreSQL real y en serie sobre una base desechable.


## 2026-09-14 — PsicoCare Educación y auditoría tipográfica

- Se reposiciona la propuesta comercial hacia el sector educativo. `/instituciones` pasa a `/educacion` con redirección permanente 308, y la navegación cambia a «Educación».
- Se explicita el modelo de negocio: PsicoCare es gratuito para las personas y las instituciones incorporan una capa institucional. Se añade una comparación entre lo que recibe la persona y lo que recibe la institución, sin restringir funciones de bienestar para crear un nivel de pago.
- La privacidad pasa a ser argumento comercial: los paneles institucionales se describen alrededor de información agregada y se indica de forma explícita que las conversaciones y reflexiones personales no forman parte del panel institucional.
- Se retiran los rangos de precio en dólares, que no eran una decisión aprobada. Ahora se indica que no hay precios cerrados y que cada programa se define por escrito.
- Se separan las vías comerciales (piloto, programa institucional, programa a medida) de las de colaboración (investigación, alianzas), con llamadas a la acción específicas en lugar de un genérico repetido.
- Se añaden momentos de la vida estudiantil, un ejemplo de programa institucional y un ejemplo de recursos propios de la institución, todos etiquetados como ejemplo y sin cifras inventadas.
- Se crea una escala tipográfica con tokens y se corrigen 79 reglas de tamaño: navegación de 11 a 15px, botones de 12 a 15px, enlaces de pie de 10 a 15px y cuerpo de tarjetas de 11–13 a 15–16px. Se conservan en miniatura únicamente los textos de la maqueta del teléfono.
- Se corrigen 34 reglas dentro de media queries que reducían el texto por debajo de la escala en móvil y tablet.
- Se amplía el formulario de contacto con cargo, tipo de institución, tamaño de la comunidad e interés, con migración `003_education_leads.sql`.
- Se corrigen dos textos que habían quedado falsos tras añadir el correo opcional: la encuesta ya no se anuncia como «sin correo».

## 2026-09-14 — Panel de respuestas, correo opcional y propuesta institucional

- El panel interno lista las respuestas finalizadas y permite leer cada una por separado, con las opciones resueltas a sus etiquetas y el texto libre incluido. Los gráficos agregados siguen exigiendo cinco respuestas completas.
- Al terminar la encuesta se puede dejar un correo de forma voluntaria, con casilla de autorización propia o iniciando sesión con Google. El correo se guarda en una tabla aparte, se puede quitar desde la misma pantalla y se borra en cascada al retirar la participación.
- El acceso con Google usa el flujo de código de autorización sin dependencias nuevas, con estado firmado que vincula una sola respuesta y caduca a los diez minutos. Si no hay credenciales configuradas, la opción no se muestra y queda solo el campo manual.
- Se añade la página de instituciones con modalidades de colaboración, niveles de alcance, funciones de licencia institucional y proceso de trabajo. Las cifras económicas se marcan de forma explícita como orientativas y se concentran en `lib/content.ts`.
- Se corrigen los textos de privacidad y consentimiento para reflejar que ahora existe un correo opcional y que el equipo autorizado puede leer respuestas individuales.
- Se añaden los datos de contacto oficiales en la sección de contacto y migración `002_participants.sql`.

## 2026-09-14 — Web de producto y validación

- Se conserva Next.js 15, React, TypeScript y Tailwind; se sustituyen la narrativa de presentación y los gráficos abstractos por una experiencia centrada en el producto.
- Se aplica la paleta oficial, Montserrat y Lora locales, el isotipo y los personajes originales del manual.
- Se incorpora demo móvil controlada con bienvenida, estado emocional, ocho módulos y progreso de las acciones de la visita. No utiliza servicios de IA.
- Se crea encuesta de 14 preguntas por pasos, consentimiento adulto, guardado recuperable, revisión, envío idempotente y retirada.
- Se añaden SQLite, migración versionada, seed idempotente, validación en servidor, límites de peticiones y retención.
- Se añade panel privado con métricas reales, restricciones para muestras pequeñas y un buzón de contactos separado.
- Se organiza información secundaria en seguridad, privacidad, nosotros y tecnología; se añaden SEO, Open Graph, icono y cabeceras de seguridad.
- Se incorporan pruebas unitarias, de persistencia, seguridad, accesibilidad y navegación responsive en ocho anchos.
- Se añaden los datos de contacto oficiales (correo y teléfono) en la sección de contacto, junto al formulario y al buzón interno.

La app móvil completa, IA y red de profesionales siguen en desarrollo. Antes de un despliegue público se deben configurar alojamiento persistente, origen, secretos administrativos y condiciones operativas de protección de datos.
