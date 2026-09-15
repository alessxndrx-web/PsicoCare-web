import type { Metadata } from "next";
import { SurveyPage } from "@/components/surveys/SurveyPage";
import { SURVEY_SLUG } from "@/lib/surveys/types";
import { googleConfigured } from "@/lib/server/google";
// Rendered per request so the Google option reflects runtime configuration, not build time.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Construyamos PsicoCare", description: "Participa voluntariamente en la encuesta de validación de PsicoCare. Anónima por defecto y para mayores de 18 años; al final puedes dejar tu correo si quieres.", alternates: { canonical: "/encuestas" } };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const notice = (await searchParams).correo;
  return <SurveyPage slug={SURVEY_SLUG} googleEnabled={googleConfigured()} notice={typeof notice === "string" ? notice : undefined}/>;
}
