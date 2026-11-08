# Descarga Android 1.3.4 — publicación candidata

El propietario autorizó publicar el candidato preparado, conservando aplazada la
prueba de cámara y voz en teléfono o emulador. No se declara precisión visual ni
validación clínica. La aplicación distingue postura observable de cómo dice sentirse
la persona y añade acompañamiento con cámara opcional, desactivado por defecto.

La descarga conserva el diseño y los cuatro botones existentes. El archivo es
`/downloads/PsicoCare-1.3.4.apk`, versión 1.3.4 / 9, firmado con el certificado de 1.3.3.
Tiene 55.192.001 bytes y SHA-256
`91db565f37d42637a10f2c3df8de72c3900458a97d0d343a683d5a301c47ca76`.
Se conserva el archivo 1.3.3 sin sobrescribirlo y se añade el comprobante `.sha256`.

El registro de descarga es `lib/downloads.ts`. No hay migraciones, cambios de cuenta,
permisos, consentimiento de encuesta ni nuevas dependencias en esta actualización.
La demo web sigue usando sus ejemplos preparados. El backend de la aplicación Android
se publica por separado en Azure y mantiene la dirección existente.

Publicación verificada: [web](https://psico-care-web.vercel.app/) y
[APK](https://psico-care-web.vercel.app/downloads/PsicoCare-1.3.4.apk), sin autenticación.
Despliegue `dpl_FVUEeg8xp2yRKQMUNdXxrv7bbjJ2`, commit
`c8a584141072fce830167b5c83c303ef60512129`, estado READY. La descarga completa
coincide con tamaño y SHA-256 del archivo firmado. Tipos, lint, siete pruebas existentes
de privacidad/analítica y compilación de producción correctos. Diez controles públicos
correctos: portada, cuatro botones de descarga, archivo completo, comprobante, cabeceras,
privacidad, cookies, educación, encuesta y panel que solicita acceso. El detalle está en
`DESCARGA_ANDROID_1_3_4_COMPROBANTE_20261108.json`.

La publicación del backend sigue pendiente. La sesión de Azure se recuperó, pero el
control del navegador se detuvo al no poder verificar la dirección de la página. No se
ejecutó el script ni se cambió el servicio. SSH también agotó el tiempo de conexión.
El APK publicado incorpora el acompañamiento local opcional; las nuevas observaciones
de postura y la respuesta controlada del servidor requieren completar esa promoción.
La descarga pública no acredita que esa parte esté activada. La prueba física continúa
aplazada; no se presenta el candidato como una evaluación clínica o visual real.

Este informe posterior se guarda en una rama documental. El commit de producción
identifica el código publicado y no se vuelve a publicar la web solo por guardar el recibo.

Reversión: el despliegue Vercel anterior es
`dpl_13Zb7jocZ11Sn5A6axJsUUYBJQvu`, commit
`ef826f526d13e2d229fa9734953440e5c231b454`. También se puede devolver únicamente
`lib/downloads.ts` a 1.3.3 mediante una rama y nueva publicación. No restaurar la base.
Un teléfono ya actualizado requiere otra versión firmada superior para corregirse;
no se recomienda desinstalar o borrar datos para intentar bajar de versión.
