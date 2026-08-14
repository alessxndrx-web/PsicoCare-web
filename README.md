# PsicoCare — Landing

Landing de presentación del proyecto **PsicoCare** para **Hackathon Nicaragua 2026**.

PsicoCare es una propuesta de plataforma de inteligencia artificial especializada en
psicología, pensada para acompañar, entrenar y orientar a jóvenes de forma
responsable, con una capa de seguridad y escalamiento hacia profesionales humanos.

> Esta landing presenta el proyecto. No es todavía la aplicación.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # build de producción
npm run start    # servir el build
```

## Editar el contenido

**Todo el texto vive en [`lib/content.ts`](lib/content.ts).** No hace falta tocar
los componentes para cambiar copy, secciones, fases del roadmap o capacidades.

La landing no incluye sección de equipo ni fotografías: no hay imágenes que
subir ni carpeta `public/` que mantener.

## Estructura

```
app/
  layout.tsx            Fuentes, metadata, skip link
  page.tsx              Orden narrativo de las secciones
  globals.css           Tokens de color, tipografía y animaciones
components/
  layout/               Navbar, Footer
  sections/             Una sección de la landing por archivo
  ui/                   Primitivas: Section, Container, Reveal, botones
  visuals/              Núcleo de IA, diagramas, pipeline de seguridad
                        (sin dependencias de imágenes: todo es SVG y CSS)
lib/
  content.ts            Todo el copy
  motion.ts             Variantes de animación compartidas
```

## Sistema de diseño

Superficies alternadas en bloques de tres para dar ritmo al scroll
(`<Section tone="deep" | "dark" | "white" | "light" | "mist">`).

Paleta: azul profundo (`ink`), azul de marca (`brand`), cian eléctrico
(`spark`) como acento, y neutros claros (`mist`).

## Criterios que respeta el contenido

La landing evita deliberadamente:

- afirmar que PsicoCare diagnostica condiciones de salud mental;
- presentarlo como reemplazo de un profesional;
- métricas, usuarios, benchmarks o resultados clínicos inventados;
- testimonios o alianzas que no existen;
- describir como implementado lo que todavía es propuesta.

Las capacidades futuras se enuncian como arquitectura propuesta y las fases del
roadmap posteriores a la actual están marcadas como *Planificado*.
