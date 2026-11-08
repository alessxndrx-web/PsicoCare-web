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

La verificación comprende compilación, tipos, lint, pruebas de privacidad y analítica,
portada y enlaces, descarga completa por HTTPS y coincidencia de tamaño y SHA-256.
Los resultados del despliegue se registran después de observar el estado READY y
la descarga pública. No se ejecuta la suite que borra tablas sin una base desechable;
no se usan credenciales ni datos de producción para las pruebas locales.

La actualización web no cambia el backend de NeuroIA ni activa memoria duradera o
capacidad pagada. Tampoco instala el APK en un teléfono: la prueba física permanece
aplazada. No declara validación clínica.

Reversión del sitio: conservar el despliegue de origen
`dpl_3rKuDMHo5dv5eTJpJWMrBkBJMNMB` y el commit `1594e365154002499d5918a59dcbd0fc4bb44fe0`.
Preferir revertir únicamente los cambios de descarga y mantener los parches de
seguridad. No restaurar ni migrar la base para revertir este cambio.
