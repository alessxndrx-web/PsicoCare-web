import type { Metadata } from "next";
import { SurveyPage } from "@/components/surveys/SurveyPage";
import { SURVEY_SLUG } from "@/lib/surveys/types";
import { googleConfigured } from "@/lib/server/google";
import { pageMetadata } from "@/lib/seo";
// Rendered per request so the Google option reflects runtime configuration, not build time.
export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({ title: "Encuesta: construyamos Psico Care", description: "Participa voluntariamente en la encuesta de validación de Psico Care. Anónima por defecto y para mayores de 18 años; al final puedes dejar tu correo si quieres.", path: "/encuestas" });
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const notice = (await searchParams).correo;
  return <SurveyPage slug={SURVEY_SLUG} googleEnabled={googleConfigured()} notice={typeof notice === "string" ? notice : undefined}/>;
}
