import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Product } from "@/components/sections/Product";
import { AppDemo } from "@/components/product-demo/AppDemo";
import { Capabilities } from "@/components/sections/Capabilities";
import { SurveyInvitation } from "@/components/sections/SurveyInvitation";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Safety } from "@/components/sections/Safety";
import { Audiences } from "@/components/sections/Audiences";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { NeuralAwakening } from "@/components/intro/NeuralAwakening";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/content";
import { mobileApplicationSchema, organizationSchema, pageMetadata, routeUpdated, webPageSchema, websiteSchema } from "@/lib/seo";
const title = "Psico Care: app de bienestar emocional con IA para jóvenes";
export const metadata: Metadata = pageMetadata({ title, description: site.description, path: "/", absoluteTitle: true });
export default function Home() {
  return <>
    <JsonLd nodes={[organizationSchema(), websiteSchema(), mobileApplicationSchema(), webPageSchema({ path: "/", name: title, description: site.description, updated: routeUpdated("/") })]}/>
    <Hero/><Product/><AppDemo/><Capabilities/><SurveyInvitation/><HowItWorks/><Safety/><Audiences/><About/><Contact/><FinalCta/>
    <NeuralAwakening/>
  </>;
}
