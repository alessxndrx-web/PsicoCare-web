/** Keep the signed, versioned Android files immutable. */
const androidRequirements = "Android 8.0 o superior";

export const androidDownload = {
  url: "/downloads/PsicoCare-1.3.5-instalacion-separada.apk",
  version: "1.3.5",
  status: "Instalación separada",
  requirements: androidRequirements,
} as const;

export const androidPreviousDownload = {
  url: "/downloads/PsicoCare-1.3.4.apk",
  version: "1.3.4",
} as const;

export const androidDownloadOptionsUrl = "/#descargar";
