import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Idea } from "@/components/sections/Idea";
import { Capabilities } from "@/components/sections/Capabilities";
import { Difference } from "@/components/sections/Difference";
import { Technology } from "@/components/sections/Technology";
import { Safety } from "@/components/sections/Safety";
import { Roadmap } from "@/components/sections/Roadmap";
import { Mission, Vision } from "@/components/sections/MissionVision";
import { Impact } from "@/components/sections/Impact";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Recorrido narrativo para el jurado:
 * problema → oportunidad → solución → tecnología → seguridad → impacto → escalabilidad
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Problem />
        <Idea />
        <Capabilities />
        <Difference />
        <Technology />
        <Safety />
        <Roadmap />
        <Mission />
        <Vision />
        <Impact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
