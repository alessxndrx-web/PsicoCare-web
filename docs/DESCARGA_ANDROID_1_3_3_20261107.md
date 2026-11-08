# Descarga Android 1.3.3 — 7 de noviembre de 2026

La descarga oficial se sirve desde el mismo sitio, sin exigir acceso a GitHub:
`/downloads/PsicoCare-1.3.3.apk`. Los botones existentes comparten el registro de
`lib/downloads.ts`. Se conserva el diseño y se identifica la versión como candidata.
Los avisos de privacidad y cookies reflejan Vercel como alojamiento de la descarga.

Archivo: 55.192.001 bytes. SHA-256:
`f3a8b440c510e4788fcf47dc4624816bf4d9c4706491ff896e6f0419570eb33a`.
Coincide con el APK 1.3.3 / 8 ya firmado y publicado por PsicoCare. El archivo con
nombre versionado no debe reemplazarse por otros bytes. Se incluye su comprobante
en `/downloads/PsicoCare-1.3.3.apk.sha256`.

La auditoría inicial detectó avisos de dependencias, incluido uno crítico de Next.js.
Se actualizaron versiones compatibles, conservando Next.js 15, React 19, las rutas,
el acceso y la configuración del proyecto. Referencias primarias:
[Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw),
[sharp](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w).
Una versión afectada no demuestra que haya ocurrido una intrusión.
La auditoría final no reporta vulnerabilidades en dependencias de producción.
Permanecen seis avisos moderados en herramientas de desarrollo; se conserva una
cadena de lint compatible en lugar de forzar versiones mayores o desactivar reglas.

Compilación de producción, tipos, lint y las siete pruebas existentes de privacidad
y analítica: correctos. Se verificó el despliegue previo a producción en Vercel y
se integró la [PR #1](https://github.com/alessxndrx-web/PsicoCare-web/pull/1).
La suite SQL no se ejecutó: necesita una base desechable y borra tablas. No se usan
credenciales ni datos de producción para las pruebas locales.

Publicación de producción observada en estado READY:
`dpl_13Zb7jocZ11Sn5A6axJsUUYBJQvu`, commit
`ef826f526d13e2d229fa9734953440e5c231b454`.
[Web pública](https://psico-care-web.vercel.app/) y
[descarga directa](https://psico-care-web.vercel.app/downloads/PsicoCare-1.3.3.apk).
La comprobación externa, sin credenciales ni cookies de sesión, terminó correctamente
el 7 de noviembre de 2026 por la noche en Nicaragua (8 de noviembre, 02:43 UTC).
La descarga completa dio HTTP 200, 55.192.001 bytes y el SHA-256 indicado arriba.
También se comprobaron los cuatro enlaces de descarga, el archivo de comprobación,
las cabeceras de seguridad, privacidad, cookies, educación, encuesta y acceso interno.
La encuesta pública devuelve sus 14 preguntas y ningún dato de participación para
esta petición anónima; el panel pide iniciar sesión. No se enviaron formularios.
Los diez controles y resultados constan en
[el comprobante JSON](DESCARGA_ANDROID_1_3_3_COMPROBANTE_20261107.json).

Antes: los botones ofrecían la versión 1.3.0 alojada en Azure. Después: los mismos
botones ofrecen el APK firmado 1.3.3 desde esta web, identificado como versión
candidata. Antes: el enlace de la publicación privada en GitHub exigía una cuenta;
después: la descarga desde la web responde sin autenticación. Se conserva el diseño.

La actualización web no cambia el backend de NeuroIA ni activa memoria duradera o
capacidad pagada. Tampoco instala el APK en un teléfono: la prueba física permanece
aplazada. No declara validación clínica.
La personalización no es un entrenamiento de pesos. La memoria entre conversaciones
permanece desactivada; esta publicación web no modifica ese estado. La consulta web
de NeuroIA sigue bajo el control del backend previamente publicado en Azure y no
se realiza desde la página de descarga. No se activan proveedores ni servicios nuevos.

Reversión del sitio: conservar el despliegue de origen
`dpl_3rKuDMHo5dv5eTJpJWMrBkBJMNMB` y el commit `1594e365154002499d5918a59dcbd0fc4bb44fe0`.
Preferir revertir únicamente los cambios de descarga y mantener los parches de
seguridad. No restaurar ni migrar la base para revertir este cambio.
Para una reversión urgente, seleccionar ese despliegue anterior en el proyecto
`psico-care-web` de Vercel y utilizar su opción de reversión. Después verificar
la portada y los enlaces públicos. Esa reversión completa también restablece
dependencias antiguas: preparar a continuación una rama que conserve los parches y
restaure únicamente `lib/downloads.ts`, los dos textos y los avisos de alojamiento
al destino anterior, o publicar una versión corregida. El APK versionado se conserva
sin sobrescribirlo. No se cambian permisos ni variables del proyecto.

Este informe y el comprobante se guardan en una rama documental posterior a la
publicación. El commit de producción anterior identifica exactamente el código
que se comprobó; no se necesita otra publicación de la web para guardar el recibo.
