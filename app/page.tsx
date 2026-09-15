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
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <><Hero/><Product/><AppDemo/><Capabilities/><SurveyInvitation/><HowItWorks/><Safety/><Audiences/><About/><Contact/><FinalCta/></>;
}
