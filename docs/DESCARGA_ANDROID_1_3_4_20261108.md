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

Verificación prevista: tipos, lint, pruebas existentes de privacidad y analítica,
compilación de producción, cuatro enlaces correctos y descarga anónima completa con
coincidencia de tamaño y SHA-256. El recibo posterior distingue publicación de APK y
publicación del backend; una no acredita la otra.

Reversión: el despliegue Vercel anterior es
`dpl_13Zb7jocZ11Sn5A6axJsUUYBJQvu`, commit
`ef826f526d13e2d229fa9734953440e5c231b454`. También se puede devolver únicamente
`lib/downloads.ts` a 1.3.3 mediante una rama y nueva publicación. No restaurar la base.
Un teléfono ya actualizado requiere otra versión firmada superior para corregirse;
no se recomienda desinstalar o borrar datos para intentar bajar de versión.
